import Joi from "joi";

import { ACTION_TYPE } from "coral-server/models/action/comment";
import {
  ExternalModerationPhase,
  filterActivePhase,
  filterExpiredSigningSecrets,
} from "coral-server/models/settings";
import { deleteTenantExternalModerationPhaseSigningSecrets } from "coral-server/models/tenant";
import {
  IntermediateModerationPhase,
  PhaseResult,
} from "coral-server/services/comments/pipeline";
import { createFetch, generateFetchOptions } from "coral-server/services/fetch";

import {
  GQLCOMMENT_BODY_FORMAT,
  GQLCOMMENT_FLAG_DETECTED_REASON,
  GQLCOMMENT_STATUS,
  GQLTAG,
  GQLUSER_ROLE,
} from "coral-server/graph/schema/__generated__/types";

import { mergePhaseResult } from "../helpers";
import { IntermediateModerationPhaseContext } from "../pipeline";

export interface ExternalModerationRequest {
  /**
   * action refers to the specific operation being performed. If `NEW`, this
   * is referring to a new comment being created. If `EDIT`, then this refers to
   * an operation involving an edit operation on an existing Comment.
   */
  action: "NEW" | "EDIT";

  /**
   * comment refers to the actual Comment data for the Comment being
   * created/edited.
   */
  comment: {
    /**
     * body refers to the actual body text of the Comment being created/edited.
     */
    body: string;

    /**
     * parentID is the identifier for the parent comment (if this Comment is a
     * reply, null otherwise).
     */
    parentID: string | null;
  };

  /**
   * author refers to the User that is creating/editing the Comment.
   */
  author: {
    /**
     * id is the identifier for this User.
     */
    id: string;

    /**
     * role refers to the role of this User.
     */
    role: GQLUSER_ROLE;
  };

  /**
   * story refers to the Story being commented on.
   */
  story: {
    /**
     * id is the identifier for this Story.
     */
    id: string;

    /**
     * url is the URL for this Story.
     */
    url: string;
  };

  /**
   * site refers to the Site that the story being commented on belongs to.
   */
  site: {
    /**
     * id is the identifier for this Site.
     */
    id: string;
  };

  /**
   * tenantID is the identifer of the Tenant that this Comment is being
   * created/edited on.
   */
  tenantID: string;

  /**
   * tenantDomain is the domain that is associated with this Tenant that this
   * Comment is being created/edited on.
   */
  tenantDomain: string;
}

export type ExternalModerationResponse = Partial<
  Pick<PhaseResult, "actions" | "status" | "tags">
>;

const ExternalModerationResponseSchema = Joi.object().keys({
  actions: Joi.array().items(
    Joi.object().keys({
      actionType: Joi.string().only().allow(ACTION_TYPE.FLAG).required(),
      reason: Joi.string()
        .only()
        .allow(
          GQLCOMMENT_FLAG_DETECTED_REASON.COMMENT_DETECTED_TOXIC,
          GQLCOMMENT_FLAG_DETECTED_REASON.COMMENT_DETECTED_SPAM
        )
        .required(),
    })
  ),
  status: Joi.string()
    .only()
    .allow(...Object.keys(GQLCOMMENT_STATUS)),
  tags: Joi.array().items(
    Joi.string().only().allow(GQLTAG.FEATURED, GQLTAG.STAFF).required()
  ),
});

/**
 * validate will validate the `ExternalModerationResponse`.
 *
 * @param body the input body that is being coerced into an `ExternalModerationResponse`.
 */
export function validateResponse(body: object): ExternalModerationResponse {
  const { value, error: err } = ExternalModerationResponseSchema.validate(
    body,
    {
      stripUnknown: true,
      presence: "optional",
      abortEarly: false,
    }
  );

  if (err) {
    throw err;
  }

  return value;
}

const fetch = createFetch({ name: "Moderation" });

/**
 * processPhase will execute the request for moderation for this particular
 * phase.
 *
 * @param ctx the context for the moderation request.
 * @param phase the current phase associated with this request.
 */
async function processPhase(
  {
    mongo,
    action,
    comment,
    bodyText,
    author,
    tenant,
    story,
    now,
    log,
  }: IntermediateModerationPhaseContext,
  phase: ExternalModerationPhase
) {
  // Create the crafted input payload to be used.
  const request: ExternalModerationRequest = {
    action,
    comment: {
      body:
        // Depending on the selected format, the comment body could be in an
        // HTML or HTML stripped format.
        phase.format === GQLCOMMENT_BODY_FORMAT.HTML ? comment.body : bodyText,
      // We're casting this to a `string | null` here because it's more
      // actionable to get a `null` rather than an undefined value in a
      // request.
      parentID: comment.parentID || null,
    },
    author: {
      id: author.id,
      role: author.role,
    },
    story: {
      id: story.id,
      url: story.url,
    },
    site: {
      id: story.siteID,
    },
    tenantID: tenant.id,
    tenantDomain: tenant.domain,
  };

  // Craft the request options now to use.
  const options = generateFetchOptions(phase.signingSecrets, request, now);

  // Send off the request, with the correct timeout.
  const res = await fetch(phase.url, {
    ...options,
    timeout: phase.timeout,
  });
  if (!res.ok) {
    // The phase did not respond correctly, continue.
    log.warn(
      { status: res.status, phaseID: phase.id },
      "failed to get moderation response"
    );
    return;
  }

  // Try to parse the response.
  const text = await res.text();

  // If the moderation phase responded 204, or there was no response from
  // the request, just continue.
  if (res.status === 204 || text === "" || text === "{}") {
    log.debug(
      { status: res.status, phaseID: phase.id },
      "empty response received"
    );
    return;
  }

  // Try to parse the response as JSON.
  const body = JSON.parse(text);

  // Remove the expired secrets in the next tick so that it does not affect
  // the sending performance of this job, and errors do not impact the
  // sending.
  const expiredSigningSecretKIDs = phase.signingSecrets
    .filter(filterExpiredSigningSecrets(now))
    .map((s) => s.kid);
  if (expiredSigningSecretKIDs.length > 0) {
    process.nextTick(() => {
      deleteTenantExternalModerationPhaseSigningSecrets(
        mongo,
        tenant.id,
        phase.id,
        expiredSigningSecretKIDs
      )
        .then(() => {
          log.info(
            { phaseID: phase.id, kids: expiredSigningSecretKIDs },
            "removed expired secrets from phase"
          );
        })
        .catch((err) => {
          log.error(
            { err },
            "an error occurred when trying to remove expired phase secrets"
          );
        });
    });
  }

  // Validate will throw an error if the body does not conform to the
  // specification.
  return validateResponse(body);
}

export const external: IntermediateModerationPhase = async (ctx) => {
  // Check to see if any custom moderation phases have been defined, if there is
  // none, exit now.
  if (
    !ctx.tenant.integrations.external ||
    ctx.tenant.integrations.external.phases.length === 0
  ) {
    return;
  }

  // Get the enabled phases.
  const phases = ctx.tenant.integrations.external.phases.filter(
    filterActivePhase()
  );
  if (phases.length === 0) {
    return;
  }

  // Collect the response we're going to make into this partial object.
  const result: Partial<PhaseResult> = {};

  // Send the input to each of the phases.
  for (const phase of phases) {
    try {
      // Get the response from the phase.
      const response = await processPhase(ctx, phase);
      if (!response) {
        continue;
      }

      // Ensure we have metadata and external moderation
      // details for metadata
      if (!result.metadata) {
        result.metadata = {};
      }
      if (!result.metadata?.externalModeration) {
        result.metadata.externalModeration = [];
      }

      // Persist a record of this external moderation phase happening
      result.metadata.externalModeration.push({
        name: phase.name,
        analyzedAt: ctx.now,
        result: {
          actions: response.actions,
          status: response.status,
          tags: response.tags,
        },
      });

      // Merge the results in. If we're finished, return now!
      const finished = mergePhaseResult(response, result);
      if (finished) {
        return result;
      }
    } catch (err) {
      ctx.log.error(
        { err, phaseID: phase.id },
        "failed to process custom moderation phase"
      );
    }
  }

  return result;
};

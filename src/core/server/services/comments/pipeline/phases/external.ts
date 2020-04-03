import Joi from "@hapi/joi";

import { ACTION_TYPE } from "coral-server/models/action/comment";
import {
  ExternalModerationPhase,
  filterActivePhase,
  filterExpiredSigningSecrets,
} from "coral-server/models/settings";
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
import { deleteTenantExternalModerationPhaseSigningSecrets } from "coral-server/models/tenant";

interface ExternalModerationPhaseRequest {
  tenant: {
    id: string;
    domain: string;
  };
  action: "NEW" | "EDIT";
  comment: {
    body: string;
    parentID: string | null;
  };
  author: {
    id: string;
    role: GQLUSER_ROLE;
  };
  story: {
    id: string;
    url: string;
  };
  site: {
    id: string;
  };
}

type ExternalModerationPhaseResponse = Partial<PhaseResult>;

const ExternalModerationPhaseResponseSchema = Joi.object().keys({
  body: Joi.string(),
  actions: Joi.array().items(
    Joi.object().keys({
      actionType: Joi.string().only().allow(ACTION_TYPE.FLAG).required(),
      reason: Joi.string()
        .only()
        .allow(...Object.keys(GQLCOMMENT_FLAG_DETECTED_REASON))
        .required(),
      additionalDetails: Joi.string(),
      metadata: Joi.object(),
    })
  ),
  status: Joi.string()
    .only()
    .allow(...Object.keys(GQLCOMMENT_STATUS)),
  metadata: Joi.object(),
  tags: Joi.array().items(
    Joi.string()
      .only()
      .allow(...Object.keys(GQLTAG))
      .required()
  ),
});

/**
 * validate will validate the `ExternalModerationPhaseResponse`.
 *
 * @param body the input body that is being coerced into an `ExternalModerationPhaseResponse`.
 */
export function validateResponse(
  body: object
): ExternalModerationPhaseResponse {
  const { value, error: err } = ExternalModerationPhaseResponseSchema.validate(
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
    htmlStripped,
    author,
    tenant,
    story,
    now,
    log,
  }: IntermediateModerationPhaseContext,
  phase: ExternalModerationPhase
) {
  // Create the crafted input payload to be used.
  const request: ExternalModerationPhaseRequest = {
    tenant: {
      id: tenant.id,
      domain: tenant.domain,
    },
    action,
    comment: {
      body:
        // Depending on the selected format, the comment body could be in an
        // HTML or HTML stripped format.
        phase.format === GQLCOMMENT_BODY_FORMAT.HTML
          ? comment.body
          : htmlStripped,
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
    .map(s => s.kid);
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
        .catch(err => {
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
    !ctx.tenant.integrations.custom ||
    ctx.tenant.integrations.custom.phases.length === 0
  ) {
    return;
  }

  // Get the enabled phases.
  const phases = ctx.tenant.integrations.custom.phases.filter(
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

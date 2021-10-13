import Joi from "joi";
import { camelCase, isEqual, omit, pick, uniqWith } from "lodash";
import { v4 as uuid } from "uuid";

import { Sub } from "coral-common/types";
import { MongoContext } from "coral-server/data/context";
import logger from "coral-server/logger";
import {
  Connection,
  FilterQuery,
  OrderedConnectionInput,
  Query,
  resolveConnection,
} from "coral-server/models/helpers";
import { TenantResource } from "coral-server/models/tenant";

import {
  GQLActionPresence,
  GQLCOMMENT_FLAG_DETECTED_REASON,
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_FLAG_REPORTED_REASON,
  GQLCOMMENT_SORT,
  GQLDontAgreeActionCounts,
  GQLFlagActionCounts,
  GQLReactionActionCounts,
} from "coral-server/graph/schema/__generated__/types";

export enum ACTION_TYPE {
  /**
   * REACTION corresponds to a reaction to a comment from a user.
   */
  REACTION = "REACTION",

  /**
   * DONT_AGREE corresponds to when a user marks a given comment that they don't
   * agree with.
   */
  DONT_AGREE = "DONT_AGREE",

  /**
   * FLAG corresponds to a flag action that indicates that the given resource needs
   * moderator attention.
   */
  FLAG = "FLAG",
}

export type EncodedCommentActionCounts = Record<string, number>;

export type FlagActionCounts = GQLFlagActionCounts;

export interface ActionCounts {
  /**
   * reaction returns the counts for the reaction action on an item.
   */
  reaction: GQLReactionActionCounts;

  /**
   * dontAgree returns the counts for the dontAgree action on an item. This edge is
   * restricted to administrators and moderators.
   */
  dontAgree: GQLDontAgreeActionCounts;

  /**
   * flag returns the counts for the flag action on an item. This edge is
   * restricted to administrators and moderators.
   */
  flag: FlagActionCounts;
}

/**
 * FLAG_REASON is the reason that a given Flag has been created.
 */
export type FLAG_REASON =
  | GQLCOMMENT_FLAG_DETECTED_REASON
  | GQLCOMMENT_FLAG_REPORTED_REASON
  | GQLCOMMENT_FLAG_REASON;

export interface CommentAction extends TenantResource {
  /**
   * id is the identifier for this specific Action.
   */
  readonly id: string;

  /**
   * actionType is the type of Action that this represents.
   */
  actionType: ACTION_TYPE;

  /**
   * commentID is the ID of the specific item that this Action is associated with.
   */
  commentID: string;

  /**
   * commentRevisionID is the ID of the specific comment text that the Action
   * is relating to.
   */
  commentRevisionID: string;

  /**
   * reason is the reason or secondary grouping identifier for why this
   * particular action was left.
   */
  reason?: FLAG_REASON;

  /**
   * additionalDetails stores information from the User as to why the Flag was
   * created or is relevant.
   */
  additionalDetails?: string;

  /**
   * storyID represents the ID of the Story where the comment was left on.
   */
  storyID: string;

  /**
   * siteID represents the ID of the Site where the comment was left on.
   */
  siteID: string;

  /**
   * userID is the ID of the User that left this Action. In the event that the
   * Action was left by Coral, it will be null.
   */
  userID: string | null;

  /**
   * createdAt is the date that this particular Action was created at.
   */
  createdAt: Date;

  /**
   * metadata is arbitrary information stored for this Action.
   */
  metadata?: Record<string, any>;

  /**
   * reviewed is whether this comment action has been reviewed by a moderator.
   */
  reviewed?: boolean;

  /**
   * section is the section of the story of the comment that this action was
   * performed on. If the section was not available when the action was authored,
   * the section will be null here.
   */
  section?: string;
}

const ActionSchema = Joi.compile([
  // Flags
  {
    actionType: ACTION_TYPE.FLAG,
    // Only reasons for the flag action will be allowed here, and it must be
    // specified.
    reason: Object.keys(GQLCOMMENT_FLAG_REASON),
  },
  // Don't Agree
  {
    actionType: ACTION_TYPE.DONT_AGREE,
  },
  // Reaction
  {
    actionType: ACTION_TYPE.REACTION,
  },
]);

/**
 * validateAction is used to validate that a specific action conforms to the
 * expected schema, `ActionSchema`.
 */
export function validateAction(
  action: Pick<CommentAction, "actionType" | "reason">
) {
  const { error } = ActionSchema.validate(
    // In typescript, this isn't an issue, but when this is transpiled to
    // javascript, it will contain additional elements.
    pick(action, ["actionType", "reason"]),
    {
      presence: "required",
      abortEarly: false,
    }
  );
  if (error) {
    // TODO: wrap error?
    throw error;
  }
}

export type CreateActionInput = Omit<
  CommentAction,
  "id" | "tenantID" | "createdAt"
>;

export interface CreateActionResultObject {
  /**
   * action contains the resultant action that was created.
   */
  action: CommentAction;

  /**
   * wasUpserted when true, indicates that this action was just newly created.
   * When false, it indicates that this action was just looked up, and had
   * existed prior to the `createAction` call.
   */
  wasUpserted: boolean;
}

export function filterDuplicateActions<T extends {}>(actions: T[]): T[] {
  return uniqWith(actions, (first, second) =>
    isEqual(omit(first, "metadata"), omit(second, "metadata"))
  );
}

export async function createAction(
  mongo: MongoContext,
  tenantID: string,
  input: CreateActionInput,
  now = new Date()
): Promise<CreateActionResultObject> {
  const { metadata, additionalDetails, ...rest } = input;

  // Create a new ID for the action.
  const id = uuid();

  // defaults are the properties set by the application when a new action is
  // created.
  const defaults: Sub<CommentAction, CreateActionInput> = {
    id,
    tenantID,
    createdAt: now,
  };

  // Extract the filter parameters.
  const filter: FilterQuery<CommentAction> = {
    tenantID,
    ...rest,
  };

  // Merge the defaults with the input.
  const action: Readonly<CommentAction> = {
    ...defaults,
    ...input,
    additionalDetails,
  };

  // Create the upsert/update operation.
  const update: { $setOnInsert: Readonly<CommentAction> } = {
    $setOnInsert: action,
  };

  // Insert the action into the database using an upsert operation.
  const result = await mongo.commentActions().findOneAndUpdate(filter, update, {
    // We are using this to create a action, so we need to upsert it.
    upsert: true,

    // False to return the updated document instead of the original document.
    // This lets us detect if the document was updated or not.
    returnOriginal: false,
  });

  // Check to see if this was a new action that was upserted, or one was found
  // that matched existing records. We are sure here that the record exists
  // because we're returning the updated document and performing an upsert
  // operation.

  // Because it's relevant that we know that the action was just created, or
  // was just looked up, we need to return the action with an object that
  // indicates if it was upserted.
  const wasUpserted = result.value!.id === id;

  // Return the action that was created/found with a boolean indicating if this
  // action was just upserted (and therefore was newly created).
  return {
    action: result.value!,
    wasUpserted,
  };
}

export async function createActions(
  mongo: MongoContext,
  tenantID: string,
  inputs: CreateActionInput[],
  now = new Date()
): Promise<CreateActionResultObject[]> {
  // TODO: (wyattjoh) replace with a batch write.
  return Promise.all(
    inputs.map((input) => createAction(mongo, tenantID, input, now))
  );
}

export type CommentActionConnectionInput = OrderedConnectionInput<
  CommentAction,
  GQLCOMMENT_SORT
>;

function applyInputToQuery(
  query: Query<CommentAction>,
  input: CommentActionConnectionInput
) {
  switch (input.orderBy) {
    case GQLCOMMENT_SORT.CREATED_AT_DESC:
      query.orderBy({ createdAt: -1 });
      if (input.after) {
        query.where({ createdAt: { $lt: input.after as Date } });
      }
      break;
    case GQLCOMMENT_SORT.CREATED_AT_ASC:
      query.orderBy({ createdAt: 1 });
      if (input.after) {
        query.where({ createdAt: { $gt: input.after as Date } });
      }
      break;
  }

  if (input.filter) {
    query.where(input.filter);
  }

  return query;
}

export async function retrieveCommentActionConnection(
  mongo: MongoContext,
  tenantID: string,
  input: CommentActionConnectionInput
): Promise<Readonly<Connection<Readonly<CommentAction>>>> {
  const query = new Query(mongo.commentActions()).where({ tenantID });
  applyInputToQuery(query, input);

  return resolveConnection(query, input, (action) => action.createdAt);
}

export async function retrieveUserAction(
  mongo: MongoContext,
  tenantID: string,
  userID: string | null,
  commentID: string,
  actionType: ACTION_TYPE
) {
  return mongo.commentActions().findOne({
    tenantID,
    actionType,
    commentID,
    userID,
  });
}

/**
 * retrieveManyUserActionPresence returns the action presence for a specific
 * user.
 */
export async function retrieveManyUserActionPresence(
  mongo: MongoContext,
  tenantID: string,
  userID: string | null,
  commentIDs: string[]
): Promise<GQLActionPresence[]> {
  const cursor = mongo.commentActions().find(
    {
      tenantID,
      userID,
      commentID: { $in: commentIDs },
    },
    {
      // We only need the commentID and actionType from the database.
      projection: {
        commentID: 1,
        actionType: 1,
      },
    }
  );

  const actions = await cursor.toArray();

  // For each of the actions returned by the query, group the actions by the
  // item id. Then compute the action presence for each of the actions.
  return commentIDs
    .map((commentID) =>
      actions.filter((action) => action.commentID === commentID)
    )
    .map((itemActions) =>
      itemActions.reduce(
        (actionPresence, { actionType }) => ({
          ...actionPresence,
          [camelCase(actionType)]: true,
        }),
        {
          reaction: false,
          dontAgree: false,
          flag: false,
        }
      )
    );
}

export type RemoveActionInput = Pick<
  CommentAction,
  "actionType" | "commentID" | "commentRevisionID" | "reason" | "userID"
>;

/**
 * The result returned by `removeAction`.
 */
export interface RemovedActionResultObject {
  /**
   * action is the action that was deleted.
   */
  action?: CommentAction;

  /**
   * wasRemoved is true when the action that was supposed to be deleted was
   * actually deleted.
   */
  wasRemoved: boolean;
}

/**
 * removeAction will delete the action based on the form of the action rather
 * than a specific action by ID.
 */
export async function removeAction(
  mongo: MongoContext,
  tenantID: string,
  input: RemoveActionInput
): Promise<RemovedActionResultObject> {
  const { reason, ...rest } = input;

  // Extract the filter parameters.
  const filter: FilterQuery<CommentAction> = {
    tenantID,
    ...rest,
  };

  // Only add the reason to the filter if it's been specified, otherwise we'll
  // never match a Flag that has an unspecified reason.
  if (reason) {
    filter.reason = reason;
  }

  // Remove the action from the database, returning the action that was deleted.
  const result = await mongo.commentActions().findOneAndDelete(filter);
  return {
    action: result.value,
    wasRemoved: Boolean(result.ok && result.value),
  };
}

/**
 * ACTION_COUNT_JOIN_CHAR is the character that is used to separate the reason
 * from the action type when storing the action counts in the models.
 */
export const ACTION_COUNT_JOIN_CHAR = "__";

/**
 * encodeActionCounts will take a list of actions, and generate action counts
 * from it.
 *
 * @param actions list of actions to generate the action counts from
 */
export function encodeActionCounts(
  ...actions: Array<Pick<CommentAction, "actionType" | "reason">>
): EncodedCommentActionCounts {
  const actionCounts: EncodedCommentActionCounts = {};

  // Loop over the actions, and increment them.
  for (const action of actions) {
    for (const key of encodeActionCountKeys(action)) {
      if (key in actionCounts) {
        actionCounts[key]++;
      } else {
        actionCounts[key] = 1;
      }
    }
  }

  return actionCounts;
}

/**
 * invertEncodedActionCounts will allow inverting of the action count object.
 *
 * @param actionCounts the encoded action counts to invert
 */
export function invertEncodedActionCounts(
  actionCounts: EncodedCommentActionCounts
): EncodedCommentActionCounts {
  for (const key in actionCounts) {
    if (!Object.prototype.hasOwnProperty.call(actionCounts, key)) {
      continue;
    }

    if (actionCounts[key] > 0) {
      actionCounts[key] = -actionCounts[key];
    }
  }

  return actionCounts;
}

/**
 * encodeActionCountKeys encodes the action into string keys which represents
 * the groupings as seen in `EncodedActionCounts`.
 */
export function encodeActionCountKeys(
  action: Pick<CommentAction, "actionType" | "reason">
): string[] {
  const keys = [action.actionType as string];
  if (action.reason) {
    keys.push(
      [action.actionType as string, action.reason as string].join(
        ACTION_COUNT_JOIN_CHAR
      )
    );
  }
  return keys;
}

interface DecodedActionCountKey {
  /**
   * actionType stores the action type referenced by the key.
   */
  actionType: ACTION_TYPE;

  /**
   * reason stores the reason referenced by the key if the actionType is FLAG.
   */
  reason?: GQLCOMMENT_FLAG_REASON;
}

/**
 * decodeActionCountGroup will unpack the key as it is encoded into the separate
 * actionType and reason.
 */
function decodeActionCountKey(key: string): DecodedActionCountKey | null {
  let actionType = "";
  let reason = "";

  if (key.includes(ACTION_COUNT_JOIN_CHAR)) {
    const keys = key.split(ACTION_COUNT_JOIN_CHAR);
    if (keys.length !== 2) {
      throw new Error(
        "invalid action count contained more than two components"
      );
    }

    actionType = keys[0];
    reason = keys[1];

    // Validate that the action type is flag.
    if (actionType !== ACTION_TYPE.FLAG) {
      // This was an invalid action type.
      logger.warn(
        { actionType },
        "found an action type that should have been flag, but wasn't"
      );
      return null;
    }

    // Validate that the reason is valid.
    if (!reason || !(reason in GQLCOMMENT_FLAG_REASON)) {
      // This was an invalid reason.
      logger.warn(
        { reason: reason || null },
        "found an invalid flagging reason"
      );
      return null;
    }
  } else {
    actionType = key;
  }

  // Validate that the action type is valid.
  if (!actionType || !(actionType in ACTION_TYPE)) {
    // This was an invalid flag given that the action type was invalid.
    logger.warn(
      { actionType: actionType || null },
      "found an invalid action type"
    );
    return null;
  }

  const result: DecodedActionCountKey = {
    actionType: actionType as ACTION_TYPE,
  };

  // Merge in the reason if it's provided. If we got here, we know that the
  // reason is a GQLCOMMENT_FLAG_REASON.
  if (reason) {
    result.reason = reason as GQLCOMMENT_FLAG_REASON;
  }

  return result;
}

/**
 * createEmptyActionCounts creates a default/empty set of action counts.
 */
function createEmptyActionCounts(): ActionCounts {
  return {
    reaction: {
      total: 0,
    },
    dontAgree: {
      total: 0,
    },
    flag: {
      total: 0,
      // Note that this isn't type checked.. We force it because TS can't
      // understand the reduce.
      reasons: Object.keys(GQLCOMMENT_FLAG_REASON).reduce(
        (reasons, reason) => ({
          ...reasons,
          [reason]: 0,
        }),
        {}
      ) as Record<GQLCOMMENT_FLAG_REASON, number>,
    },
  };
}

export function mergeCommentActionCounts(
  ...actionCounts: EncodedCommentActionCounts[]
): EncodedCommentActionCounts {
  const mergedActionCounts: EncodedCommentActionCounts = {};

  for (const counts of actionCounts) {
    for (const [key, count] of Object.entries(counts)) {
      if (key in mergedActionCounts) {
        mergedActionCounts[key] += count;
      } else {
        mergedActionCounts[key] = count;
      }
    }
  }

  return mergedActionCounts;
}

export function countTotalActionCounts(
  actionCounts: EncodedCommentActionCounts
): number {
  return Object.values(actionCounts).reduce((total, count) => total + count, 0);
}

/**
 * decodeActionCounts will take the encoded action counts and decode them into
 * a useable format.
 *
 * @param encodedActionCounts the action counts to decode
 */
export function decodeActionCounts(
  encodedActionCounts: EncodedCommentActionCounts
): ActionCounts {
  // Default all the action counts to zero.
  const actionCounts: ActionCounts = createEmptyActionCounts();

  // Loop over all the encoded action counts to extract each of the action
  // counts as they are encoded.
  Object.entries(encodedActionCounts).forEach(([key, count]) => {
    // Decode the encoded action count key.
    const decoded = decodeActionCountKey(key);
    if (!decoded) {
      // If there was an error decoding the action count keys, skip this entry.
      return;
    }

    // Pull out the action type and the reason from the key.
    const { actionType, reason } = decoded;

    // Handle the different types and reasons.
    incrementActionCounts(actionCounts, actionType, reason, count);
  });

  return actionCounts;
}

function incrementActionCounts(
  actionCounts: ActionCounts,
  actionType: ACTION_TYPE,
  reason: GQLCOMMENT_FLAG_REASON | undefined,
  count = 1
) {
  switch (actionType) {
    case ACTION_TYPE.REACTION:
      actionCounts.reaction.total += count;
      break;
    case ACTION_TYPE.DONT_AGREE:
      actionCounts.dontAgree.total += count;
      break;
    case ACTION_TYPE.FLAG:
      // When we have a reason, we are incrementing for that particular reason
      // rather than incrementing for the total. If we don't have a reason, we
      // just got the updated reason.
      if (reason) {
        actionCounts.flag.reasons[reason] += count;
      } else {
        actionCounts.flag.total += count;
      }
      break;
    default:
      throw new Error("unexpected action type");
  }

  return actionCounts;
}

/**
 * removeStoryModerationActions will remove all the Moderation Action's associated
 * with the story
 */
export async function removeStoryModerationActions(
  mongo: MongoContext,
  tenantID: string,
  storyID: string,
  isArchive = false
) {
  const coll =
    isArchive && mongo.archive
      ? mongo.archivedCommentModerationActions()
      : mongo.commentModerationActions();
  return coll.deleteMany({
    tenantID,
    storyID,
  });
}

/**
 * removeStoryActions will remove all the Action's associated with the story
 */
export async function removeStoryActions(
  mongo: MongoContext,
  tenantID: string,
  storyID: string,
  isArchive = false
) {
  const coll =
    isArchive && mongo.archive
      ? mongo.archivedCommentActions()
      : mongo.commentActions();
  return coll.deleteMany({
    tenantID,
    storyID,
  });
}

/**
 * mergeManyRootActions will update many Action `storyID`'s from one to
 * another.
 */
export async function mergeManyStoryActions(
  mongo: MongoContext,
  tenantID: string,
  newStoryID: string,
  oldStoryIDs: string[]
) {
  return mongo.commentActions().updateMany(
    {
      tenantID,
      storyID: {
        $in: oldStoryIDs,
      },
    },
    {
      $set: {
        storyID: newStoryID,
      },
    }
  );
}

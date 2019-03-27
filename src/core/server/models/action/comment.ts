import Joi from "joi";
import { camelCase, isEqual, omit, pick, uniqWith } from "lodash";
import { Db } from "mongodb";
import uuid from "uuid";

import { Omit, Sub } from "talk-common/types";
import {
  GQLActionCounts,
  GQLActionPresence,
  GQLCOMMENT_FLAG_DETECTED_REASON,
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_FLAG_REPORTED_REASON,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { createIndexFactory } from "talk-server/models/helpers/indexing";
import { FilterQuery } from "talk-server/models/helpers/query";
import { TenantResource } from "talk-server/models/tenant";

function collection(mongo: Db) {
  return mongo.collection<Readonly<CommentAction>>("commentActions");
}

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
   * userID is the ID of the User that left this Action. In the event that the
   * Action was left by Talk, it will be null.
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
}

export async function createCommentActionIndexes(mongo: Db) {
  const createIndex = createIndexFactory(collection(mongo));

  // UNIQUE { id }
  await createIndex({ tenantID: 1, id: 1 }, { unique: true });

  // { actionType, commentID }
  await createIndex(
    { tenantID: 1, actionType: 1, commentID: 1, userID: 1 },
    { background: true }
  );
}

const ActionSchema = [
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
];

/**
 * validateAction is used to validate that a specific action conforms to the
 * expected schema, `ActionSchema`.
 */
export function validateAction(
  action: Pick<CommentAction, "actionType" | "reason">
) {
  const { error } = Joi.validate(
    // In typescript, this isn't an issue, but when this is transpiled to
    // javascript, it will contain additional elements.
    pick(action, ["actionType", "reason"]),
    ActionSchema,
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
  mongo: Db,
  tenantID: string,
  input: CreateActionInput,
  now = new Date()
): Promise<CreateActionResultObject> {
  const { metadata, additionalDetails, ...filter } = input;

  // Create a new ID for the action.
  const id = uuid.v4();

  // defaults are the properties set by the application when a new action is
  // created.
  const defaults: Sub<CommentAction, CreateActionInput> = {
    id,
    tenantID,
    createdAt: now,
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
  const result = await collection(mongo).findOneAndUpdate(filter, update, {
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
  mongo: Db,
  tenantID: string,
  inputs: CreateActionInput[],
  now = new Date()
): Promise<CreateActionResultObject[]> {
  // TODO: (wyattjoh) replace with a batch write.
  return Promise.all(
    inputs.map(input => createAction(mongo, tenantID, input, now))
  );
}

export async function retrieveUserAction(
  mongo: Db,
  tenantID: string,
  userID: string | null,
  commentID: string,
  actionType: ACTION_TYPE
) {
  return collection(mongo).findOne({
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
  mongo: Db,
  tenantID: string,
  userID: string | null,
  commentIDs: string[]
): Promise<GQLActionPresence[]> {
  const cursor = await collection(mongo).find(
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
    .map(commentID => actions.filter(action => action.commentID === commentID))
    .map(itemActions =>
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
  mongo: Db,
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
  const result = await collection(mongo).findOneAndDelete(filter);
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
    if (!actionCounts.hasOwnProperty(key)) {
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
function encodeActionCountKeys(
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
function decodeActionCountKey(key: string): DecodedActionCountKey {
  let actionType: string = "";
  let reason: string = "";

  if (key.indexOf(ACTION_COUNT_JOIN_CHAR) >= 0) {
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
      throw new Error("invalid action type, expected only flag to have reason");
    }

    // Validate that the reason is valid.
    if (!reason || !(reason in GQLCOMMENT_FLAG_REASON)) {
      throw new Error("expected flag to have a reason that was valid");
    }
  } else {
    actionType = key;
  }

  // Validate that the action type is valid.
  if (!actionType || !(actionType in ACTION_TYPE)) {
    throw new Error("expected action to have an action type that was valid");
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
function createEmptyActionCounts(): GQLActionCounts {
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
): GQLActionCounts {
  // Default all the action counts to zero.
  const actionCounts: GQLActionCounts = createEmptyActionCounts();

  // Loop over all the encoded action counts to extract each of the action
  // counts as they are encoded.
  Object.entries(encodedActionCounts).forEach(([key, count]) => {
    // Pull out the action type and the reason from the key.
    const { actionType, reason } = decodeActionCountKey(key);

    // Handle the different types and reasons.
    incrementActionCounts(actionCounts, actionType, reason, count);
  });

  return actionCounts;
}

function incrementActionCounts(
  actionCounts: GQLActionCounts,
  actionType: ACTION_TYPE,
  reason: GQLCOMMENT_FLAG_REASON | undefined,
  count: number = 1
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
 * removeRootActions will remove all the Action's associated with a given root
 * identifier.
 */
export async function removeStoryActions(
  mongo: Db,
  tenantID: string,
  storyID: string
) {
  return collection(mongo).deleteMany({
    tenantID,
    storyID,
  });
}

/**
 * mergeManyRootActions will update many Action `storyID`'s from one to
 * another.
 */
export async function mergeManyStoryActions(
  mongo: Db,
  tenantID: string,
  newStoryID: string,
  oldStoryIDs: string[]
) {
  return collection(mongo).updateMany(
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

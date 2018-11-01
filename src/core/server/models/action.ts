import Joi from "joi";
import { camelCase, pick } from "lodash";
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
import { FilterQuery } from "talk-server/models/query";
import { TenantResource } from "talk-server/models/tenant";

function collection(db: Db) {
  return db.collection<Readonly<Action>>("actions");
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

export type EncodedActionCounts = Record<string, number>;

export interface ActionCountGroup {
  total: number;
}

export enum ACTION_ITEM_TYPE {
  COMMENTS = "COMMENTS",
}

/**
 * FLAG_REASON is the reason that a given Flag has been created.
 */
export type FLAG_REASON =
  | GQLCOMMENT_FLAG_DETECTED_REASON
  | GQLCOMMENT_FLAG_REPORTED_REASON
  | GQLCOMMENT_FLAG_REASON;

export interface Action extends TenantResource {
  /**
   * id is the identifier for this specific Action.
   */
  readonly id: string;

  /**
   * action_type is the type of Action that this represents.
   */
  action_type: ACTION_TYPE;

  /**
   * item_type enables polymorphic behavior be allowing multiple item types
   * to be represented in a single collection.
   */
  item_type: ACTION_ITEM_TYPE;

  /**
   * item_id is the ID of the specific item that this Action is associated with.
   */
  item_id: string;

  /**
   * reason is the reason or secondary grouping identifier for why this
   * particular action was left.
   */
  reason?: FLAG_REASON;

  /**
   * root_item_id represents the identifier for the item's associated item. In
   * the case of a REACTION left on a Comment, this ID would be the Stories ID.
   * In the case of a FLAG left on a User, this ID would be null.
   */
  root_item_id?: string;

  /**
   * user_id is the ID of the User that left this Action. In the event that the
   * Action was left by Talk, it will be null.
   */
  user_id?: string;

  /**
   * created_at is the date that this particular Action was created at.
   */
  created_at: Date;

  /**
   * metadata is arbitrary information stored for this Action.
   */
  metadata?: Record<string, any>;
}

const ActionSchema = [
  // Flags
  {
    item_type: ACTION_ITEM_TYPE.COMMENTS,
    action_type: ACTION_TYPE.FLAG,
    // Only reasons for the flag action will be allowed here, and it must be
    // specified.
    reason: Object.keys(GQLCOMMENT_FLAG_REASON),
  },
  // Don't Agree
  {
    item_type: ACTION_ITEM_TYPE.COMMENTS,
    action_type: ACTION_TYPE.DONT_AGREE,
  },
  // Reaction
  {
    item_type: ACTION_ITEM_TYPE.COMMENTS,
    action_type: ACTION_TYPE.REACTION,
  },
];

/**
 * validateAction is used to validate that a specific action conforms to the
 * expected schema, `ActionSchema`.
 */
export function validateAction(
  action: Pick<Action, "item_type" | "action_type" | "reason">
) {
  const { error } = Joi.validate(
    // In typescript, this isn't an issue, but when this is transpiled to
    // javascript, it will contain additional elements.
    pick(action, ["item_type", "action_type", "reason"]),
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

export type CreateActionInput = Omit<Action, "id" | "tenant_id" | "created_at">;

export interface CreateActionResultObject {
  /**
   * action contains the resultant action that was created.
   */
  action: Action;

  /**
   * wasUpserted when true, indicates that this action was just newly created.
   * When false, it indicates that this action was just looked up, and had
   * existed prior to the `createAction` call.
   */
  wasUpserted: boolean;
}

export async function createAction(
  mongo: Db,
  tenantID: string,
  input: CreateActionInput
): Promise<CreateActionResultObject> {
  // Create a new ID for the action.
  const id = uuid.v4();

  // defaults are the properties set by the application when a new action is
  // created.
  const defaults: Sub<Action, CreateActionInput> = {
    id,
    tenant_id: tenantID,
    created_at: new Date(),
  };

  // Merge the defaults with the input.
  const action: Readonly<Action> = {
    ...defaults,
    ...input,
  };

  // This filter ensures that a given user can't flag/respect a given user more
  // than once.
  const filter: FilterQuery<Action> = {
    action_type: input.action_type,
    item_type: input.item_type,
    item_id: input.item_id,
    reason: input.reason,
    user_id: input.user_id,
  };

  // Create the upsert/update operation.
  const update: { $setOnInsert: Readonly<Action> } = {
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
  inputs: CreateActionInput[]
): Promise<CreateActionResultObject[]> {
  // TODO: (wyattjoh) replace with a batch write.
  return Promise.all(inputs.map(input => createAction(mongo, tenantID, input)));
}

/**
 * retrieveManyUserActionPresence returns the action presence for a specific
 * user.
 */
export async function retrieveManyUserActionPresence(
  mongo: Db,
  tenantID: string,
  userID: string | null,
  itemType: ACTION_ITEM_TYPE,
  itemIDs: string[]
): Promise<GQLActionPresence[]> {
  const cursor = await collection(mongo).find(
    {
      tenant_id: tenantID,
      user_id: userID,
      item_type: itemType,
      item_id: { $in: itemIDs },
    },
    {
      // We only need the item_id and action_type from the database.
      projection: {
        item_id: 1,
        action_type: 1,
      },
    }
  );

  const actions = await cursor.toArray();

  // For each of the actions returned by the query, group the actions by the
  // item id. Then compute the action presence for each of the actions.
  return itemIDs
    .map(itemID => actions.filter(action => action.item_id === itemID))
    .map(itemActions =>
      itemActions.reduce(
        (actionPresence, { action_type }) => ({
          ...actionPresence,
          [camelCase(action_type)]: true,
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
  Action,
  "action_type" | "item_type" | "item_id" | "reason" | "user_id"
>;

/**
 * The result returned by `removeAction`.
 */
export interface RemovedActionResultObject {
  /**
   * action is the action that was deleted.
   */
  action?: Action;

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
  // Extract the filter parameters.
  const filter: FilterQuery<Action> = {
    tenant_id: tenantID,
    action_type: input.action_type,
    item_type: input.item_type,
    item_id: input.item_id,
    user_id: input.user_id,
  };

  // Only add the reason to the filter if it's been specified, otherwise we'll
  // never match a Flag that has an unspecified reason.
  if (input.reason) {
    filter.reason = input.reason;
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
export function encodeActionCounts(...actions: Action[]): EncodedActionCounts {
  const actionCounts: EncodedActionCounts = {};

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
  actionCounts: EncodedActionCounts
): EncodedActionCounts {
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
function encodeActionCountKeys(action: Action): string[] {
  const keys = [action.action_type as string];
  if (action.reason) {
    keys.push(
      [action.action_type as string, action.reason as string].join(
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

/**
 * decodeActionCounts will take the encoded action counts and decode them into
 * a useable format.
 *
 * @param encodedActionCounts the action counts to decode
 */
export function decodeActionCounts(
  encodedActionCounts: EncodedActionCounts
): GQLActionCounts {
  // Default all the action counts to zero.
  const actionCounts: GQLActionCounts = createEmptyActionCounts();

  // Loop over all the encoded action counts to extract each of the action
  // counts as they are encoded.
  Object.entries(encodedActionCounts).map(([key, count]) => {
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
export async function removeRootActions(
  mongo: Db,
  tenantID: string,
  rootItemID: string
) {
  return collection(mongo).deleteMany({
    tenant_id: tenantID,
    root_item_id: rootItemID,
  });
}

/**
 * mergeManyRootActions will update many Action `root_item_id'`s from one to
 * another.
 */
export async function mergeManyRootActions(
  mongo: Db,
  tenantID: string,
  newRootItemID: string,
  oldRootItemIDs: string[]
) {
  return collection(mongo).updateMany(
    {
      tenant_id: tenantID,
      root_item_id: {
        $in: oldRootItemIDs,
      },
    },
    {
      $set: {
        root_item_id: newRootItemID,
      },
    }
  );
}

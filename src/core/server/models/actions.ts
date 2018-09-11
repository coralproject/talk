import Joi from "joi";
import { pick } from "lodash";
import { Db } from "mongodb";
import uuid from "uuid";

import { Omit, Sub } from "talk-common/types";
import { GQLCOMMENT_FLAG_REASON } from "talk-server/graph/tenant/schema/__generated__/types";
import { FilterQuery } from "talk-server/models/query";
import { TenantResource } from "talk-server/models/tenant";

function collection(db: Db) {
  return db.collection<Readonly<Action>>("actions");
}

export type ActionCounts = Record<string, number>;

export enum ACTION_TYPE {
  /**
   * REACTION corresponds to a reaction to a comment from a user.
   */
  REACTION = "REACTION",

  /**
   * FLAG corresponds to a flag action that indicates that the given resource needs
   * moderator attention.
   */
  FLAG = "FLAG",

  /**
   * DONT_AGREE corresponds to when a user marks a given comment that they don't
   * agree with.
   */
  DONT_AGREE = "DONT_AGREE",
}

export enum ACTION_ITEM_TYPE {
  COMMENTS = "COMMENTS",
}

export interface Action extends TenantResource {
  readonly id: string;
  action_type: ACTION_TYPE;
  item_type: ACTION_ITEM_TYPE;
  item_id: string;
  reason?: GQLCOMMENT_FLAG_REASON;
  user_id?: string;
  created_at: Date;
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
  return Promise.all(inputs.map(input => createAction(mongo, tenantID, input)));
}

/**
 * generateActionCounts will take a list of actions, and generate action counts
 * from it.
 *
 * @param actions list of actions to generate the action counts from
 */
export function generateActionCounts(...actions: Action[]): ActionCounts {
  const actionCounts: ActionCounts = {};

  /**
   * increment the key in the action counts variable.
   */
  function incr(...keys: string[]) {
    const key = keys.join("_");
    if (key in actionCounts) {
      actionCounts[key]++;
    } else {
      actionCounts[key] = 1;
    }
  }

  function transform(action: Action) {
    const actionType = action.action_type.toLowerCase();

    // Add the action type to the action counts.
    incr(actionType);

    // Check if the reason is set.
    const reason = action.reason && action.reason.toLowerCase();
    if (reason) {
      // Add the action type to the action counts.
      incr(actionType, reason);
    }
  }

  // Loop over the actions, and increment them.
  for (const action of actions) {
    transform(action);
  }

  return actionCounts;
}

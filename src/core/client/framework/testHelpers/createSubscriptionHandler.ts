import { GQLSubscription } from "coral-framework/schema";
import { DeepPartial } from "coral-framework/types";

export type SubscriptionVariables<T extends SubscriptionResolver<any, any>> =
  T extends SubscriptionResolver<infer V, any> ? V : any;

export type SubscriptionResponse<T extends SubscriptionResolver<any, any>> =
  T extends SubscriptionResolver<any, infer R> ? DeepPartial<R> : any;

/**
 * SubscriptionResolver matches the shape of Subscription
 * resolvers in the schema generated types.
 */
export interface SubscriptionResolver<V, R> {
  resolve?: (parent: any, args: V, context: any, info: any) => R;
}

type SubscriptionField = keyof GQLSubscription;

/**
 * Subscription represents a subscription currently requested from the client.
 */
export interface Subscription<T extends SubscriptionResolver<any, any> = any> {
  /** field of the subscription field being requested */
  field: SubscriptionField;
  /** variables of the subscription field being requested */
  variables: SubscriptionVariables<T>;
  /** dispatch data to this subscription */
  dispatch(data: SubscriptionResponse<T>): void;
}

/**
 * SubscriptionHandlerReadOnly enables to write tests with subscriptions.
 */
export interface SubscriptionHandlerReadOnly {
  /** List of current active subscriptions */
  readonly subscriptions: ReadonlyArray<Subscription>;
  /**
   * dispatch will look for subscriptions of the field `field` and
   * calls the `callback` for each of them. If `callback` returns data,
   * it'll be dispatched to that subscription.
   *
   * @param field name of subscription field to look for.
   * @param callback callback is called for every subscription on this field.
   */
  dispatch<T extends SubscriptionResolver<any, any> = any>(
    field: SubscriptionField,
    callback: (
      variables: SubscriptionVariables<T>
    ) => SubscriptionResponse<T> | void
  ): void;
  has(field: SubscriptionField): boolean;
}

/**
 * SubscriptionHandler enables to write tests with subscriptions
 * and to manipulate the current list of subscriptions.
 */
export interface SubscriptionHandler extends SubscriptionHandlerReadOnly {
  add(subscription: Subscription): void;
  remove(subscription: Subscription): void;
}

export default function createSubscriptionHandler(): SubscriptionHandler {
  const subscriptions: Subscription[] = [];
  const handler: SubscriptionHandler = {
    subscriptions,
    dispatch: (field, callback) => {
      subscriptions.forEach((s) => {
        if (s.field === field) {
          const data = callback(s.variables);
          if (data) {
            s.dispatch(data);
          }
        }
      });
    },
    has: (field) => subscriptions.some((s) => s.field === field),
    add: (s) => {
      subscriptions.push(s);
    },
    remove: (s) => {
      const index = subscriptions.findIndex((x) => x === s);
      if (index !== -1) {
        subscriptions.splice(index, 1);
      }
    },
  };
  return handler;
}

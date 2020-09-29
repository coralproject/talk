import { Context } from "coral-server/context";

import { CoralEventPayload } from "./event";
import { CoralEventType } from "./types";

export type CoralEventHandler<T extends CoralEventPayload = any> = (
  ctx: Context,
  payload: T
) => Promise<void>;

export abstract class CoralEventListener<T extends CoralEventPayload = any> {
  /**
   * name is the name of the listener used for identification in logs.
   */
  public abstract readonly name: string;

  /**
   * disabled if true will disable the event listener from handling requests.
   */
  public abstract readonly disabled?: boolean;

  /**
   * events is the array of event types that this listener should listen for.
   */
  public abstract readonly events: CoralEventType[];

  public abstract handle: CoralEventHandler<T>;
}

declare module "@rudderstack/rudder-sdk-node" {
  export interface Event {
    userId?: string;
    anonymousId?: string;
    event: string;
    properties: Record<string, any>;
    timestamp?: Date;
  }

  type Callback = (err?: Error) => void;

  class Analytics {
    constructor(writeKey: string, dataPlaneURI: string);

    public track(payload: Event, callback?: Callback): void;
  }

  export default Analytics;
}

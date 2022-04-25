import { Component } from "react";

import { CoralContext, withContext } from "coral-framework/lib/bootstrap";

interface Props {
  window: CoralContext["window"];
  eventEmitter: CoralContext["eventEmitter"];
}

export class OnEventsForRudderStack extends Component<Props> {
  constructor(props: Props) {
    super(props);
    props.eventEmitter.onAny((eventName: string, value: any) => {
      const [namespace, ...rest] = eventName.split(".");
      if (
        !["viewer", "mutation", "subscription", "fetch"].includes(namespace)
      ) {
        return;
      }
      const rudder = (props.window as any).rudderanalytics;
      if (rudder) {
        // Reconstruct name, but remove `viewer.` prefix.
        const eventNameWithoutNS = rest.join(".");
        let name = eventNameWithoutNS;
        if (namespace !== "viewer") {
          name = `${namespace}.${name}`;
        }

        rudder.track(name, value, () => {});
      }
    });
  }

  public render() {
    return null;
  }
}

const enhanced = withContext(({ eventEmitter, window }) => ({
  eventEmitter,
  window,
}))(OnEventsForRudderStack);
export default enhanced;

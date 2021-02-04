import { Component } from "react";

import { CoralContext, withContext } from "coral-framework/lib/bootstrap";

interface Props {
  window: CoralContext["window"];
  pym: CoralContext["pym"];
  eventEmitter: CoralContext["eventEmitter"];
}

export class OnEvents extends Component<Props> {
  constructor(props: Props) {
    super(props);
    props.eventEmitter.onAny((eventName: string, value: any) => {
      props.pym!.sendMessage(
        "event",
        JSON.stringify({
          eventName,
          value,
        })
      );

      const rudder = (props.window as any).rudderanalytics;
      if (rudder) {
        rudder.track(eventName, value, () => {});
      }
    });
  }

  public render() {
    return null;
  }
}

const enhanced = withContext(({ pym, eventEmitter, window }) => ({
  pym,
  eventEmitter,
  window,
}))(OnEvents);
export default enhanced;

import { Component } from "react";

import { CoralContext, withContext } from "coral-framework/lib/bootstrap";

interface Props {
  pym: CoralContext["pym"];
  eventEmitter: CoralContext["eventEmitter"];
}

export class OnEvents extends Component<Props> {
  constructor(props: Props) {
    super(props);
    // Auth popup will use this to handle a successful login.
    props.eventEmitter.onAny((eventName: string, value: any) => {
      props.pym!.sendMessage(
        "event",
        JSON.stringify({
          eventName,
          value,
        })
      );
    });
  }

  public render() {
    return null;
  }
}

const enhanced = withContext(({ pym, eventEmitter }) => ({
  pym,
  eventEmitter,
}))(OnEvents);
export default enhanced;

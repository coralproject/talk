import { Component } from "react";

import { TalkContext, withContext } from "talk-framework/lib/bootstrap";

interface Props {
  pym: TalkContext["pym"];
  eventEmitter: TalkContext["eventEmitter"];
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

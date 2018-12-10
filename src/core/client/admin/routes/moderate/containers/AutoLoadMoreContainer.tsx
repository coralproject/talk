import React from "react";

import { withInView } from "talk-framework/lib/intersection";
import { Spinner } from "talk-ui/components";

interface Props {
  inView: boolean | undefined;
  intersectionRef: React.Ref<any>;
  disableLoadMore: boolean;
  onLoadMore: () => void;
}

class AutoLoadMoresContainer extends React.Component<Props> {
  public componentWillReceiveProps(nextProps: Props) {
    if (nextProps.inView && !nextProps.disableLoadMore) {
      nextProps.onLoadMore();
    }
  }
  public render() {
    return (
      <div ref={this.props.intersectionRef}>
        <Spinner />
      </div>
    );
  }
}

const enhanced = withInView(AutoLoadMoresContainer);

export default enhanced;

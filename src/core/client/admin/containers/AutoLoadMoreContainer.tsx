import React from "react";

import { withInView } from "talk-framework/lib/intersection";
import { BaseButton, Spinner } from "talk-ui/components";

interface Props {
  inView: boolean | undefined;
  intersectionRef: React.Ref<any>;
  disableLoadMore?: boolean;
  onLoadMore: () => void;
}

class AutoLoadMoresContainer extends React.Component<Props> {
  public componentWillReceiveProps(nextProps: Props) {
    if (nextProps.inView && !nextProps.disableLoadMore) {
      nextProps.onLoadMore();
    }
  }
  public render() {
    // We can't really test infinite scrolling behavior
    // with jsdom in our feature tests, so we'll just a
    // button here to make it testable.
    if (process.env.NODE_ENV === "test") {
      return (
        <BaseButton
          onClick={this.props.onLoadMore}
          disabled={this.props.disableLoadMore}
        >
          Load More
        </BaseButton>
      );
    }
    return (
      <div ref={this.props.intersectionRef}>
        <Spinner />
      </div>
    );
  }
}

const enhanced = withInView(AutoLoadMoresContainer);

export default enhanced;

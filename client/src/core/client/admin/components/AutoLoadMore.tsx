import React, { FunctionComponent, useEffect } from "react";

import { useInView } from "coral-framework/lib/intersection";
import { Button, Spinner } from "coral-ui/components/v2";

interface Props {
  disableLoadMore?: boolean;
  onLoadMore: () => void;
}

const AutoLoadMoresContainer: FunctionComponent<Props> = ({
  onLoadMore,
  disableLoadMore = false,
}) => {
  const { inView, intersectionRef } = useInView();

  useEffect(() => {
    if (!inView || disableLoadMore) {
      return;
    }

    onLoadMore();
  }, [disableLoadMore, inView, onLoadMore]);

  // We can't really test infinite scrolling behavior
  // with jsdom in our feature tests, so we'll just a
  // button here to make it testable.
  if (process.env.NODE_ENV === "test") {
    return (
      <Button onClick={onLoadMore} disabled={disableLoadMore} variant="text">
        Load More
      </Button>
    );
  }
  return (
    <div ref={intersectionRef}>
      <Spinner />
    </div>
  );
};

export default AutoLoadMoresContainer;

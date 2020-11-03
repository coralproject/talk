import React, { FunctionComponent, useCallback } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { Button, ButtonIcon } from "coral-ui/components/v2";

import styles from "./AllCommentsLinks.css";

const AllCommentsLinks: FunctionComponent = () => {
  const { pym } = useCoralContext();
  const onGoToArticleTop = useCallback(() => {
    if (!pym) {
      return;
    }

    pym.scrollParentTo("");
  }, [pym]);
  const onGoToCommentsTop = useCallback(() => {
    if (!pym) {
      return;
    }

    pym.scrollParentToChildPos(0);
  }, [pym]);

  const classes = {
    sizeRegular: styles.sizeRegular,
    colorRegular: styles.colorRegular,
    active: styles.active,
    mouseHover: styles.mouseHover,
    disabled: styles.disabled,
  };

  return (
    <div className={styles.container}>
      <Button
        className={styles.link}
        title="Go to top of comments"
        onClick={onGoToCommentsTop}
        variant="textUnderlined"
        color="regular"
        iconLeft
        classes={classes}
        uppercase={false}
      >
        <ButtonIcon>forum</ButtonIcon>
        <span>Top of comments</span>
      </Button>
      <Button
        className={styles.link}
        title="Go to top of article"
        onClick={onGoToArticleTop}
        variant="textUnderlined"
        color="regular"
        iconLeft
        classes={classes}
        uppercase={false}
      >
        <ButtonIcon>description</ButtonIcon>
        <span>Top of article</span>
      </Button>
    </div>
  );
};

export default AllCommentsLinks;

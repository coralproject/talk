import React, { FunctionComponent, useCallback } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { Button, Icon } from "coral-ui/components/v2";

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
    document.body.scrollIntoView({ behavior: "smooth" });
  }, []);

  const classes = {
    sizeRegular: styles.sizeRegular,
    colorRegular: styles.colorRegular,
    active: styles.active,
    mouseHover: styles.mouseHover,
    disabled: styles.disabled,
  };

  return (
    <div className={styles.border}>
      <Button
        className={styles.link}
        title="Go to top of comments"
        onClick={onGoToCommentsTop}
        variant="textUnderlined"
        color="regular"
        classes={classes}
        uppercase={false}
      >
        <Icon className={styles.icon}>forum</Icon>
        <span>Top of comments</span>
      </Button>
      <Button
        className={styles.link}
        title="Go to top of article"
        onClick={onGoToArticleTop}
        variant="textUnderlined"
        color="regular"
        classes={classes}
        uppercase={false}
      >
        <Icon className={styles.icon}>description</Icon>
        <span>Top of article</span>
      </Button>
    </div>
  );
};

export default AllCommentsLinks;

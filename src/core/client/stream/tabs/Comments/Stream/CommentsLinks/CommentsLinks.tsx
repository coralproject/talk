import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FC, FunctionComponent, useCallback } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useMutation } from "coral-framework/lib/relay";
import { Mutation as SetActiveTabMutation } from "coral-stream/App/SetActiveTabMutation";
import CLASSES from "coral-stream/classes";
import { Button, ButtonIcon } from "coral-ui/components/v2";
import { PropTypesOf } from "coral-ui/types";

import styles from "./CommentsLinks.css";

interface Props {
  showGoToDiscussions: boolean;
  showGoToProfile: boolean;
}

const FooterButton: FC<
  Pick<
    PropTypesOf<typeof Button>,
    "onClick" | "title" | "className" | "children" | "classes"
  > & {
    icon: string;
  }
> = (props) => (
  <Button
    className={cn(styles.link, props.className)}
    title={props.title}
    onClick={props.onClick}
    variant="textUnderlined"
    color="regular"
    iconLeft
    classes={props.classes}
    uppercase={false}
  >
    <ButtonIcon className={styles.icon}>{props.icon}</ButtonIcon>
    <span>{props.children}</span>
  </Button>
);

const CommentsLinks: FunctionComponent<Props> = ({
  showGoToDiscussions,
  showGoToProfile,
}) => {
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

  const setActiveTab = useMutation(SetActiveTabMutation);

  const onGoToDiscussions = useCallback(() => {
    void setActiveTab({ tab: "DISCUSSIONS" });
  }, [setActiveTab]);

  const onGoToProfile = useCallback(() => {
    void setActiveTab({ tab: "PROFILE" });
  }, [setActiveTab]);

  const classes = {
    sizeRegular: styles.sizeRegular,
    colorRegular: styles.colorRegular,
    active: styles.active,
    mouseHover: styles.mouseHover,
    disabled: styles.disabled,
  };

  return (
    <div className={cn(styles.container, CLASSES.streamFooter.$root)}>
      {showGoToProfile && (
        <Localized id="stream-footer-links-profile" attrs={{ title: true }}>
          <FooterButton
            className={CLASSES.streamFooter.profileLink}
            title="Go to profile and replies"
            onClick={onGoToProfile}
            classes={classes}
            icon="account_box"
          >
            Profile and replies
          </FooterButton>
        </Localized>
      )}
      {showGoToDiscussions && (
        <Localized id="stream-footer-links-discussions" attrs={{ title: true }}>
          <FooterButton
            className={CLASSES.streamFooter.discussionsLink}
            title="Go to more discussions"
            onClick={onGoToDiscussions}
            classes={classes}
            icon="list_alt"
          >
            More discussions
          </FooterButton>
        </Localized>
      )}
      <Localized
        id="stream-footer-links-top-of-comments"
        attrs={{ title: true }}
      >
        <FooterButton
          className={CLASSES.streamFooter.commentsTopLink}
          title="Go to top of comments"
          onClick={onGoToCommentsTop}
          classes={classes}
          icon="forum"
        >
          Top of comments
        </FooterButton>
      </Localized>
      <Localized
        id="stream-footer-links-top-of-article"
        attrs={{ title: true }}
      >
        <FooterButton
          className={CLASSES.streamFooter.articleTopLink}
          title="Go to top of article"
          onClick={onGoToArticleTop}
          classes={classes}
          icon="description"
        >
          Top of article
        </FooterButton>
      </Localized>
    </div>
  );
};

export default CommentsLinks;

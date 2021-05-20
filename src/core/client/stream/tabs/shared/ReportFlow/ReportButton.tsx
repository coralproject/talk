import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { MutationProp, withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import {
  ShowAuthPopupMutation,
  withShowAuthPopupMutation,
} from "coral-stream/common/AuthPopup";
import { Flex, Icon, MatchMedia } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { ReportButton_comment } from "coral-stream/__generated__/ReportButton_comment.graphql";
import { ReportButton_viewer } from "coral-stream/__generated__/ReportButton_viewer.graphql";

import styles from "./ReportButton.css";

interface Props {
  onClick: () => void;
  open?: boolean | null;

  showAuthPopup: MutationProp<typeof ShowAuthPopupMutation>;
  comment: ReportButton_comment;
  viewer: ReportButton_viewer | null;

  variant?: "chat" | "regular";
}

const ReportButton: FunctionComponent<Props> = ({
  onClick,
  showAuthPopup,
  comment,
  viewer,
  open,
  variant = "regular",
}) => {
  const isLoggedIn = !!viewer;

  const isReported =
    comment.viewerActionPresence &&
    (comment.viewerActionPresence.flag ||
      comment.viewerActionPresence.dontAgree);

  const signIn = useCallback(() => {
    void showAuthPopup({ view: "SIGN_IN" });
  }, [showAuthPopup]);

  if (isReported) {
    return (
      <Localized
        id="comments-reportButton-aria-reported"
        attrs={{ "aria-label": true }}
      >
        <div
          className={cn(CLASSES.comment.actionBar.reportedButton, {
            [styles.reported]: variant === "regular",
            [styles.reportedChat]: variant === "chat",
          })}
          data-testid="comment-reported-button"
        >
          <Flex alignItems="center">
            <Icon size="sm" className={styles.icon}>
              flag
            </Icon>
            <MatchMedia gteWidth="mobile">
              {(matches) =>
                matches ? (
                  <Localized id="comments-reportButton-reported">
                    Reported
                  </Localized>
                ) : null
              }
            </MatchMedia>
          </Flex>
        </div>
      </Localized>
    );
  }

  return (
    <Localized
      id="comments-reportButton-aria-report"
      attrs={{ "aria-label": true }}
      $username={comment.author ? comment.author.username : ""}
    >
      <Button
        className={cn(CLASSES.comment.actionBar.reportButton, {
          [styles.reportChat]: variant === "chat",
        })}
        variant={open ? "filled" : "flat"}
        active={Boolean(open)}
        color="secondary"
        fontSize="small"
        fontWeight="semiBold"
        paddingSize="extraSmall"
        onClick={isLoggedIn ? onClick : signIn}
        data-testid="comment-report-button"
      >
        <Flex alignItems="center" container="span">
          <Icon size="sm" className={styles.icon}>
            flag
          </Icon>
          <MatchMedia gteWidth="mobile">
            <Localized id="comments-reportButton-report">
              <span>Report</span>
            </Localized>
          </MatchMedia>
        </Flex>
      </Button>
    </Localized>
  );
};

const enhanced = withShowAuthPopupMutation(
  withFragmentContainer<Props>({
    viewer: graphql`
      fragment ReportButton_viewer on User {
        id
      }
    `,
    comment: graphql`
      fragment ReportButton_comment on Comment {
        id
        author {
          username
        }
        viewerActionPresence {
          dontAgree
          flag
        }
      }
    `,
  })(ReportButton)
);

export default enhanced;

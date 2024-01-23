import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";
import Responsive from "react-responsive";

import { MutationProp, withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import {
  ShowAuthPopupMutation,
  withShowAuthPopupMutation,
} from "coral-stream/common/AuthPopup";
import { FlagPlainIcon, SvgIcon } from "coral-ui/components/icons";
import { Flex, MatchMedia } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { ReportButton_comment } from "coral-stream/__generated__/ReportButton_comment.graphql";
import { ReportButton_settings } from "coral-stream/__generated__/ReportButton_settings.graphql";
import { ReportButton_viewer } from "coral-stream/__generated__/ReportButton_viewer.graphql";

import styles from "./ReportButton.css";

interface Props {
  onClick: () => void;
  open?: boolean | null;

  showAuthPopup: MutationProp<typeof ShowAuthPopupMutation>;
  comment: ReportButton_comment;
  viewer: ReportButton_viewer | null;
  settings: ReportButton_settings;
}

const ReportButton: FunctionComponent<Props> = ({
  onClick,
  showAuthPopup,
  comment,
  viewer,
  settings,
  open,
}) => {
  const isLoggedIn = !!viewer;

  const isReported =
    comment.viewerActionPresence &&
    (comment.viewerActionPresence.flag ||
      comment.viewerActionPresence.dontAgree ||
      comment.viewerActionPresence.illegal);

  const signIn = useCallback(() => {
    void showAuthPopup({ view: "SIGN_IN" });
  }, [showAuthPopup]);

  const handleOnClick = useCallback(() => {
    if (settings.dsa?.enabled) {
      onClick();
      return;
    }
    if (isLoggedIn) {
      onClick();
    } else {
      signIn();
    }
  }, [isLoggedIn, onClick, signIn, settings]);

  if (isReported) {
    return (
      <Localized
        id="comments-reportButton-aria-reported"
        attrs={{ "aria-label": true }}
      >
        <div
          className={cn(
            CLASSES.comment.actionBar.reportedButton,
            styles.reported
          )}
          data-testid="comment-reported-button"
        >
          <Flex alignItems="center">
            <SvgIcon
              strokeWidth="semibold"
              className={styles.icon}
              Icon={FlagPlainIcon}
            />
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
      vars={{ username: comment.author?.username ?? "" }}
    >
      <Button
        className={cn(CLASSES.comment.actionBar.reportButton)}
        variant={open ? "filled" : "flat"}
        active={Boolean(open)}
        color="secondary"
        fontSize="small"
        fontWeight="semiBold"
        paddingSize="extraSmall"
        onClick={handleOnClick}
        data-testid="comment-report-button"
      >
        <Flex alignItems="center" container="span">
          <SvgIcon className={styles.icon} Icon={FlagPlainIcon} />
          <Responsive minWidth={400}>
            <Localized id="comments-reportButton-report">
              <span>Report</span>
            </Localized>
          </Responsive>
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
          illegal
        }
      }
    `,
    settings: graphql`
      fragment ReportButton_settings on Settings {
        dsa {
          enabled
        }
      }
    `,
  })(ReportButton)
);

export default enhanced;

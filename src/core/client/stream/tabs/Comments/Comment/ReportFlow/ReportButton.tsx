import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback, useMemo } from "react";
import { graphql } from "react-relay";
import Responsive from "react-responsive";

import { withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import {
  ShowAuthPopupMutation,
  withShowAuthPopupMutation,
} from "coral-stream/mutations";
import { Flex, Icon, MatchMedia } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { ReportButton_comment } from "coral-stream/__generated__/ReportButton_comment.graphql";
import { ReportButton_viewer } from "coral-stream/__generated__/ReportButton_viewer.graphql";

import styles from "./ReportButton.css";

interface Props {
  onClick: () => void;
  open?: boolean | null;

  showAuthPopup: ShowAuthPopupMutation;
  comment: ReportButton_comment;
  viewer: ReportButton_viewer | null;
}

const ReportButton: FunctionComponent<Props> = ({
  onClick,
  showAuthPopup,
  comment,
  viewer,
  open,
}) => {
  const onClickReport = useCallback(() => {
    onClick();
  }, [onClick]);

  const isLoggedIn = useMemo(() => {
    return Boolean(viewer);
  }, [viewer]);

  const isReported = useMemo(() => {
    return (
      comment.viewerActionPresence &&
      (comment.viewerActionPresence.flag ||
        comment.viewerActionPresence.dontAgree)
    );
  }, [comment]);

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
          className={cn(
            CLASSES.comment.actionBar.reportedButton,
            styles.reported
          )}
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
    >
      <Button
        className={cn(CLASSES.comment.actionBar.reportButton)}
        variant={open ? "filled" : "flat"}
        active={Boolean(open)}
        color="secondary"
        fontSize="small"
        fontWeight="semiBold"
        paddingSize="extraSmall"
        onClick={isLoggedIn ? onClickReport : signIn}
        data-testid="comment-report-button"
      >
        <Flex alignItems="center" container="span">
          <Icon size="sm" className={styles.icon}>
            flag
          </Icon>
          <Responsive minWidth={400}>
            <Localized id="comments-reportButton-report">Report</Localized>
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
        viewerActionPresence {
          dontAgree
          flag
        }
      }
    `,
  })(ReportButton)
);

export default enhanced;

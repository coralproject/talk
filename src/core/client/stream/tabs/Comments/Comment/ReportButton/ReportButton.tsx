import { Localized } from "@fluent/react/compat";
import React, { Ref } from "react";

import { PropTypesOf } from "coral-framework/types";
import { Button, Icon, MatchMedia } from "coral-ui/components/v2";
import { withForwardRef } from "coral-ui/hocs";

import styles from "./ReportButton.css";

interface Props extends Omit<PropTypesOf<typeof Button>, "ref"> {
  reported: boolean;

  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLButtonElement>;
}

class ReportButton extends React.Component<Props> {
  public render() {
    const {
      reported,
      accessKey,
      active,
      forwardRef: ref,
      ...rest
    } = this.props;
    return (
      <Localized
        id={
          reported
            ? "comments-reportButton-aria-reported"
            : "comments-reportButton-aria-report"
        }
        attrs={{ "aria-label": true }}
      >
        <Button
          {...rest}
          active={active}
          disabled={!active && reported}
          classes={
            (reported &&
              !active && {
                variantText: styles.variantText,
              }) ||
            {}
          }
          variant="text"
          size="regular"
          color="mono"
          ref={ref}
          data-testid="comment-report-button"
        >
          <Icon>flag</Icon>
          <MatchMedia gtWidth="xs">
            {!reported && (
              <Localized id="comments-reportButton-report">
                <span>Report</span>
              </Localized>
            )}
            {reported && (
              <Localized id="comments-reportButton-reported">
                <span>Reported</span>
              </Localized>
            )}
          </MatchMedia>
        </Button>
      </Localized>
    );
  }
}

export default withForwardRef(ReportButton);

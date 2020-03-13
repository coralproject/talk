import { Localized } from "@fluent/react/compat";
import React, { Ref } from "react";

import { PropTypesOf } from "coral-framework/types";
import { Button, Icon, MatchMedia } from "coral-ui/components/v2";
import { withForwardRef } from "coral-ui/hocs";

import styles from "./ReportButton.css";

interface Props extends PropTypesOf<typeof Button> {
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
      <Button
        {...rest}
        active={active}
        disabled={!active && reported}
        classes={
          (reported &&
            !active && {
              variantText: styles.variantText,
              colorMono: styles.colorMono,
            }) ||
          {}
        }
        variant="text"
        size="regular"
        color="mono"
        ref={ref}
      >
        <MatchMedia gtWidth="xs">
          <Icon>flag</Icon>
        </MatchMedia>
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
      </Button>
    );
  }
}

export default withForwardRef(ReportButton);

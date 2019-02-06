import { Localized } from "fluent-react/compat";
import React, { Ref } from "react";

import { PropTypesOf } from "talk-framework/types";
import { Button, ButtonIcon, MatchMedia } from "talk-ui/components";
import { withForwardRef } from "talk-ui/hocs";

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
        classes={(reported && !active && styles) || {}}
        variant="ghost"
        size="small"
        ref={ref}
      >
        <MatchMedia gtWidth="xs">
          <ButtonIcon>flag</ButtonIcon>
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

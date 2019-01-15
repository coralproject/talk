import { Localized } from "fluent-react/compat";
import React from "react";

import { PropTypesOf } from "talk-framework/types";
import { Button, ButtonIcon, MatchMedia } from "talk-ui/components";

import styles from "./ReportButton.css";

interface Props extends PropTypesOf<typeof Button> {
  reported: boolean;
}

class ReportButton extends React.Component<Props> {
  public render() {
    const { reported, accessKey, active, ...rest } = this.props;
    return (
      <Button
        {...rest}
        active={active}
        disabled={!active && reported}
        classes={(reported && !active && styles) || {}}
        variant="ghost"
        size="small"
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

export default ReportButton;

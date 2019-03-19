import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { BaseButton, ClickOutside, Icon, Popover } from "talk-ui/components";

import DecisionHistoryQuery from "../views/decisionHistory/queries/DecisionHistoryQuery";

import styles from "./DecisionHistoryButton.css";

const popoverID = "decision-history-popover";

const DecisionHistoryButton: StatelessComponent = () => (
  <Localized id="decisionHistory-popover" attrs={{ description: true }}>
    <Popover
      data-testid="decisionHistory-popover"
      id={popoverID}
      placement="bottom-end"
      description="A dialog showing the decision history"
      classes={{ popover: styles.popover }}
      body={({ toggleVisibility }) => (
        <ClickOutside onClickOutside={toggleVisibility}>
          <div>
            <DecisionHistoryQuery onClosePopover={toggleVisibility} />
          </div>
        </ClickOutside>
      )}
    >
      {({ toggleVisibility, ref, visible }) => (
        <BaseButton
          onClick={toggleVisibility}
          aria-controls={popoverID}
          ref={ref}
          className={styles.historyIcon}
          data-testid="decisionHistory-toggle"
        >
          <Icon size="lg">history</Icon>
        </BaseButton>
      )}
    </Popover>
  </Localized>
);

export default DecisionHistoryButton;

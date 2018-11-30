import React from "react";

import { oncePerFrame } from "talk-common/utils";
import { BaseButton, ClickOutside, Icon, Popover } from "talk-ui/components";

import DecisionHistoryQuery from "../views/decisionHistory/queries/DecisionHistoryQuery";
import styles from "./DecisionHistoryButton.css";

class DecisionHistoryButton extends React.Component {
  // Helper that prevents calling toggleVisibility more then once per frame.
  // In essence this means we'll process an event only once.
  // This might happen, when clicking on the button which will
  // cause its onClick to happen as well as onClickOutside.
  private toggleVisibilityOncePerFrame = oncePerFrame(
    (toggleVisibility: () => void) => toggleVisibility()
  );

  public render() {
    const popoverID = `decision-history-popover`;
    return (
      <Popover
        data-test="decisionHistory-popover"
        id={popoverID}
        placement="bottom-end"
        description="A dialog showing a permalink to the comment"
        classes={{ popover: styles.popover }}
        body={({ toggleVisibility }) => (
          <ClickOutside
            onClickOutside={() =>
              this.toggleVisibilityOncePerFrame(toggleVisibility)
            }
          >
            <div>
              <DecisionHistoryQuery />
            </div>
          </ClickOutside>
        )}
      >
        {({ toggleVisibility, forwardRef, visible }) => (
          <BaseButton
            onClick={() => this.toggleVisibilityOncePerFrame(toggleVisibility)}
            aria-controls={popoverID}
            forwardRef={forwardRef}
            className={styles.historyIcon}
            data-test="decisionHistory-toggle"
          >
            <Icon size="lg">history</Icon>
          </BaseButton>
        )}
      </Popover>
    );
  }
}

export default DecisionHistoryButton;

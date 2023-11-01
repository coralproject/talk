import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { GQLREJECTION_REASON_CODE } from "coral-framework/schema";
import { /* Button, */ RadioButton } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { unsnake } from "./formatting";

import styles from "./ModerationReason.css";

export interface Props {
  onCode: (code: GQLREJECTION_REASON_CODE) => void;
  selected: GQLREJECTION_REASON_CODE | null;
  onAddExplanation: () => void;
}

const AddExpanationButton: FunctionComponent<{ onClick: () => void }> = ({
  onClick,
}) => (
  <Localized id="moderationReason-addExplanation">
    <Button
      onClick={onClick}
      className={styles.optionAction}
      variant="none"
      color="success"
    >
      + Add explanation
    </Button>
  </Localized>
);

const Reasons: FunctionComponent<Props> = ({
  selected,
  onCode,
  onAddExplanation,
}) => {
  return (
    <>
      <Localized id="moderationReason-reason">
        <span className={styles.sectionLabel}>Reason</span>
      </Localized>

      {Object.values(GQLREJECTION_REASON_CODE)
        .filter(
          (code) =>
            code !== GQLREJECTION_REASON_CODE.ILLEGAL_CONTENT &&
            code !== GQLREJECTION_REASON_CODE.OTHER
        )
        .map((code) => (
          <>
            <Localized id={`moderationReason-rejectionReason-${code}`}>
              <RadioButton
                value={code}
                name={code}
                key={code}
                checked={selected === code}
                onChange={(e) => {
                  if (e.target.checked) {
                    onCode(code);
                  }
                }}
              >
                {unsnake(code)}
              </RadioButton>
            </Localized>

            {selected === code && (
              <AddExpanationButton onClick={onAddExplanation} />
            )}
          </>
        ))}

      <Localized id="moderationReason-reason-moreReasons">
        <span className={styles.sectionLabel}>+ More reasons</span>
      </Localized>

      <>
        <Localized
          id={`moderationReason-rejectionReason-${GQLREJECTION_REASON_CODE.OTHER}`}
        >
          <RadioButton
            value={GQLREJECTION_REASON_CODE.OTHER}
            name={GQLREJECTION_REASON_CODE.OTHER}
            key={GQLREJECTION_REASON_CODE.OTHER}
            checked={selected === GQLREJECTION_REASON_CODE.OTHER}
            onChange={(e) => {
              if (e.target.checked) {
                onCode(GQLREJECTION_REASON_CODE.OTHER);
                onAddExplanation();
              }
            }}
          >
            {unsnake(GQLREJECTION_REASON_CODE.OTHER)}
          </RadioButton>
        </Localized>
      </>
    </>
  );
};

export default Reasons;

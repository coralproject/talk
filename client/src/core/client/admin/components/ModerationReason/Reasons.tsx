import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { GQLREJECTION_REASON_CODE } from "coral-framework/schema";
import { /* Button, */ RadioButton } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { unsnake } from "./formatting";

import commonStyles from "./ModerationReason.css";

export interface Props {
  onCode: (code: GQLREJECTION_REASON_CODE) => void;
  selected: GQLREJECTION_REASON_CODE | null;
  onAddExplanation: () => void;
}

const AddExplanationButton: FunctionComponent<{ onClick: () => void }> = ({
  onClick,
}) => (
  <Localized id="common-moderationReason-addExplanation">
    <Button
      onClick={onClick}
      className={commonStyles.optionAction}
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
  /* eslint-disable */
  console.log({ GQLREJECTION_REASON_CODE })
  return (
    <>
      <Localized id="common-moderationReason-reason">
        <span className={commonStyles.sectionLabel}>Reason</span>
      </Localized>

      {Object.values(GQLREJECTION_REASON_CODE)
        .filter(
          (code) =>
            code !== GQLREJECTION_REASON_CODE.ILLEGAL_CONTENT &&
            code !== GQLREJECTION_REASON_CODE.BANNED_WORD &&
            code !== GQLREJECTION_REASON_CODE.OTHER
        )
        .map((code) => (
          <div key={code}>
            <Localized id={`common-moderationReason-rejectionReason-${code}`}>
              <RadioButton
                value={code}
                name={code}
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
              <AddExplanationButton onClick={onAddExplanation} />
            )}
          </div>
        ))}

      <Localized id="common-moderationReason-reason-moreReasons">
        <span className={commonStyles.sectionLabel}>+ More reasons</span>
      </Localized>

      <>
        <Localized
          id={`common-moderationReason-rejectionReason-${GQLREJECTION_REASON_CODE.OTHER}`}
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

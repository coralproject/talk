import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { GQLREJECTION_REASON_CODE } from "coral-framework/schema";
import { RadioButton } from "coral-ui/components/v2";

import { unsnake } from "./formatting";

import commonStyles from "./ModerationReason.css";

export interface Props {
  onCode: (code: GQLREJECTION_REASON_CODE) => void;
  selected: GQLREJECTION_REASON_CODE | null;
}

const Reasons: FunctionComponent<Props> = ({ selected, onCode }) => {
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
          </div>
        ))}

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
            }
          }}
        >
          {unsnake(GQLREJECTION_REASON_CODE.OTHER)}
        </RadioButton>
      </Localized>
    </>
  );
};

export default Reasons;

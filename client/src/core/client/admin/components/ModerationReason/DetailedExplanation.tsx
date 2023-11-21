import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useState } from "react";

import { GQLREJECTION_REASON_CODE } from "coral-framework/schema";
import { Label } from "coral-ui/components/v2";
import { TextArea } from "coral-ui/components/v3";
import { Button } from "coral-ui/components/v3/Button/Button";

import { unsnake } from "./formatting";

import styles from "./DetailedExplanation.css";
import commonStyles from "./ModerationReason.css";

export interface Props {
  onChange: (value: string) => void;
  code: GQLREJECTION_REASON_CODE;
  value: string | null;
  onBack: () => void;
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

const DetailedExplanation: FunctionComponent<Props> = ({
  code,
  value,
  onChange,
  onBack,
}) => {
  const [showAddExplanation, setShowAddExplanation] = useState(
    !!(code === GQLREJECTION_REASON_CODE.OTHER)
  );

  return (
    <>
      <Localized id="common-moderationReason-changeReason">
        <Button className={styles.changeReason} variant="none" onClick={onBack}>
          &lt; Change Reason
        </Button>
      </Localized>

      <Localized id="common-moderationReason-reasonLabel">
        <Label>Reason</Label>
      </Localized>

      <Localized id={`common-moderationReason-rejectionReason-${code}`}>
        <div className={styles.code}>{unsnake(code)}</div>
      </Localized>

      {showAddExplanation ? (
        <>
          <Localized id="common-moderationReason-detailedExplanation">
            <Label
              className={cn(commonStyles.sectionLabel, styles.explanationLabel)}
            >
              Explanation
            </Label>
          </Localized>

          <Localized
            id="common-moderationReason-detailedExplanation-placeholder"
            attrs={{ placeholder: true }}
          >
            <TextArea
              className={styles.detailedExplanation}
              placeholder="Add your explanation"
              data-testid="moderation-reason-detailed-explanation"
              value={value || undefined}
              onChange={(e) => onChange(e.target.value)}
            />
          </Localized>
        </>
      ) : (
        <AddExplanationButton onClick={() => setShowAddExplanation(true)} />
      )}
    </>
  );
};

export default DetailedExplanation;

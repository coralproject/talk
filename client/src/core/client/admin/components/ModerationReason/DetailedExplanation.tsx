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
  onChangeExplanation: (value: string) => void;
  onChangeCustomReason: (value: string) => void;
  code: GQLREJECTION_REASON_CODE;
  explanationValue: string | null;
  customReasonValue: string | null;
  onBack: () => void;
  linkClassName?: string;
}

const AddExplanationButton: FunctionComponent<{
  onClick: () => void;
  linkClassName?: string;
}> = ({ onClick, linkClassName }) => (
  <Localized id="common-moderationReason-addExplanation">
    <Button
      onClick={onClick}
      className={cn(linkClassName, commonStyles.optionAction)}
      variant="flat"
      color="primary"
      underline
    >
      + Add explanation
    </Button>
  </Localized>
);

const DetailedExplanation: FunctionComponent<Props> = ({
  code,
  explanationValue,
  onChangeExplanation,
  onBack,
  customReasonValue,
  onChangeCustomReason,
  linkClassName,
}) => {
  const [showAddExplanation, setShowAddExplanation] = useState(false);

  return (
    <>
      <Localized id="common-moderationReason-changeReason">
        <Button
          className={cn(linkClassName, styles.changeReason)}
          variant="flat"
          onClick={onBack}
          color="primary"
          underline
        >
          &lt; Change reason
        </Button>
      </Localized>

      <Localized id="common-moderationReason-reasonLabel">
        <Label>Reason</Label>
      </Localized>

      <Localized id={`common-moderationReason-rejectionReason-${code}`}>
        <div className={styles.code}>{unsnake(code)}</div>
      </Localized>

      {code === GQLREJECTION_REASON_CODE.OTHER && (
        <>
          <Localized id="common-moderationReason-customReason">
            <Label
              className={cn(commonStyles.sectionLabel, styles.explanationLabel)}
            >
              Custom reason (required)
            </Label>
          </Localized>
          <Localized
            id="common-moderationReason-customReason-placeholder"
            attrs={{ placeholder: true }}
          >
            <TextArea
              className={styles.detailedExplanation}
              placeholder="Add your reason"
              value={customReasonValue || undefined}
              onChange={(e) => onChangeCustomReason(e.target.value)}
            />
          </Localized>
        </>
      )}

      {showAddExplanation ? (
        <>
          <Localized id="common-moderationReason-detailedExplanation">
            <Label
              className={cn(commonStyles.sectionLabel, styles.explanationLabel)}
            >
              Detailed explanation (shared with commenter)
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
              value={explanationValue || undefined}
              onChange={(e) => onChangeExplanation(e.target.value)}
            />
          </Localized>
        </>
      ) : (
        <AddExplanationButton
          onClick={() => setShowAddExplanation(true)}
          linkClassName={linkClassName}
        />
      )}
    </>
  );
};

export default DetailedExplanation;

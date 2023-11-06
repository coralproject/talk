import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { GQLREJECTION_REASON_CODE } from "coral-framework/schema";
import { Label, RadioButton } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3/Button/Button";

import { TextArea } from "coral-ui/components/v3";
import { unsnake } from "./formatting";
import styles from "./ModerationReason.css";

export interface Props {
  onChange: (value: string) => void;
  code: GQLREJECTION_REASON_CODE;
  value: string | null;
  onBack: () => void;
}

const DetailedExplantion: FunctionComponent<Props> = ({
  code,
  value,
  onChange,
  onBack,
}) => {
  return (
    <>
      <Localized id={`common-moderationReason-rejectionReason-${code}`}>
        <RadioButton value={code} name={code} key={code} checked>
          {unsnake(code)}
        </RadioButton>
      </Localized>

      <Localized id="common-moderationReason-changeReason">
        <Button
          className={cn(styles.optionAction, styles.changeReason)}
          variant="none"
          onClick={onBack}
        >
          Change Reason
        </Button>
      </Localized>

      <Localized id="common-moderationReason-detailedExplanation">
        <Label className={cn(styles.sectionLabel, styles.explanationLabel)}>
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
  );
};

export default DetailedExplantion;

/* eslint-disable */
import React, { FunctionComponent, useCallback, useState } from "react";

import { Button, Card, Flex, RadioButton } from "coral-ui/components/v2";

import { RejectCommentReasonInput } from "coral-stream/__generated__/RejectCommentMutation.graphql";

import { Localized } from "@fluent/react/compat";
import { GQLREJECTION_REASON_CODE } from "coral-framework/schema";
import { TextArea } from "coral-ui/components/v3";
import styles from "./ModerationReason.css";

type Reason = RejectCommentReasonInput;
type ReasonCode = GQLREJECTION_REASON_CODE;

const unsnake = (code: string): string => {
  const parts = code.split("_");
  return parts
    .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

const AddExpanationButton: FunctionComponent<{ onClick: () => void }> = ({onClick}) =>
  <Localized id="moderationReason-addExplanation">
    <Button onClick={onClick} className={styles.addExplanation} variant="underlined" size="small" uppercase={false}>
      + Add explanation
    </Button>
  </Localized>

export interface Props {
  onCancel: () => void;
  onReason: (reason: Reason) => void;
}

const ModerationReason: FunctionComponent<Props> = ({ onCancel, onReason }) => {
  const [reasonCode, setReasonCode] = useState<ReasonCode | null>(null);
  const [legalGrounds, setLegalGrounds] = useState<string | null>(null);
  const [detailedExplaination, setDetailedExplaination] = useState<
    string | null
  >(null);

  const submitReason = useCallback(() => {
    onReason({
      code: reasonCode!,
      legalGrounds:
        reasonCode === GQLREJECTION_REASON_CODE.ILLEGAL_CONTENT
          ? legalGrounds
          : undefined,
      detailedExplaination:
        reasonCode === GQLREJECTION_REASON_CODE.OTHER ||
        reasonCode === GQLREJECTION_REASON_CODE.ILLEGAL_CONTENT
          ? detailedExplaination
          : undefined,
    });
  }, [reasonCode, legalGrounds, detailedExplaination, onReason]);

  return (
    <Card className={styles.root} data-testid="moderation-reason-modal">
      {/* <Flex className={styles.innerWrapper}> */}
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
                  checked={reasonCode === code}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setReasonCode(code);
                    }
                  }}
                >
                  {unsnake(code)}
                </RadioButton>
              </Localized>

              {reasonCode === code && (
                <Localized id="moderationReason-addExplanation">
                  <Button variant="underlined" size="small" uppercase={false}>
                    + Add explanation
                  </Button>
                </Localized>
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
              checked={reasonCode === GQLREJECTION_REASON_CODE.OTHER}
              onChange={(e) => {
                if (e.target.checked) {
                  setReasonCode(GQLREJECTION_REASON_CODE.OTHER);
                }
              }}
            >
              {unsnake(GQLREJECTION_REASON_CODE.OTHER)}
            </RadioButton>
          </Localized>

          {reasonCode === GQLREJECTION_REASON_CODE.OTHER && (
            <AddExpanationButton onClick={() => alert("TODO: explanatioin view")} />
          )}
        </>

        <Flex className={styles.buttons}>
          <Localized id="moderationReason-cancel">
            <Button className={styles.cancelButton} variant="outlined" color="mono" onClick={onCancel}>
              Cancel
            </Button>
          </Localized>

          <Localized id="moderationReason-reject">
            <Button
              className={styles.rejectButton}
              disabled={reasonCode === null}
              onClick={submitReason}
              color="alert"
            >
              Reject
            </Button>
          </Localized>
        </Flex>

      {/* </Flex> */}
    </Card>
  );
};

export default ModerationReason;

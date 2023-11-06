import React, { FunctionComponent, useCallback, useState } from "react";

import { Button, Card, Flex } from "coral-ui/components/v2";

import { RejectCommentReasonInput } from "coral-stream/__generated__/RejectCommentMutation.graphql";

import { Localized } from "@fluent/react/compat";
import { GQLREJECTION_REASON_CODE } from "coral-framework/schema";

import DetailedExplantion from "./DetailedExplanation";
import Reasons from "./Reasons";

import styles from "./ModerationReason.css";

type Reason = RejectCommentReasonInput;
type ReasonCode = GQLREJECTION_REASON_CODE;

export interface Props {
  onCancel: () => void;
  onReason: (reason: Reason) => void;
}

const ModerationReason: FunctionComponent<Props> = ({ onCancel, onReason }) => {
  const [view, setView] = useState<"REASON" | "EXPLANATION">("REASON");
  const [reasonCode, setReasonCode] = useState<ReasonCode | null>(null);
  // TODO (marcushaddon): will we ever submit legal grounds via this component?
  const [legalGrounds] = useState<string | null>(null);
  const [detailedExplanation, setDetailedExplanation] = useState<string | null>(
    null
  );

  const submitReason = useCallback(() => {
    onReason({
      code: reasonCode!,
      legalGrounds:
        reasonCode === GQLREJECTION_REASON_CODE.ILLEGAL_CONTENT
          ? legalGrounds
          : undefined,
      detailedExplanation: detailedExplanation || undefined,
    });
  }, [reasonCode, legalGrounds, detailedExplanation, onReason]);

  return (
    <Card className={styles.root} data-testid="moderation-reason-modal">
      {view === "REASON" ? (
        <Reasons
          selected={reasonCode}
          onCode={setReasonCode}
          onAddExplanation={() => setView("EXPLANATION")}
        />
      ) : (
        <DetailedExplantion
          onBack={() => setView("REASON")}
          code={reasonCode!}
          value={detailedExplanation}
          onChange={setDetailedExplanation}
        />
      )}

      <Flex className={styles.buttons}>
        <Localized id="common-moderationReason-cancel">
          <Button
            className={styles.cancelButton}
            variant="outlined"
            color="mono"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Localized>

        <Localized id="common-moderationReason-reject">
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
    </Card>
  );
};

export default ModerationReason;

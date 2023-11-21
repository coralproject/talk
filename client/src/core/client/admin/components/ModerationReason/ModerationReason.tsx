import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import { GQLREJECTION_REASON_CODE } from "coral-framework/schema";
import { Box, Button, Flex } from "coral-ui/components/v2";

import { RejectCommentReasonInput } from "coral-stream/__generated__/RejectCommentMutation.graphql";

import DetailedExplanation from "./DetailedExplanation";
import Reasons from "./Reasons";

import styles from "./ModerationReason.css";

type Reason = RejectCommentReasonInput;
type ReasonCode = GQLREJECTION_REASON_CODE;

export interface Props {
  onCancel: () => void;
  onReason: (reason: Reason) => void;
  id: string;
}

const ModerationReason: FunctionComponent<Props> = ({
  onCancel,
  onReason,
  id,
}) => {
  const [view, setView] = useState<"REASON" | "EXPLANATION">("REASON");
  const [reasonCode, setReasonCode] = useState<ReasonCode | null>(null);

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
    <Box className={styles.root} data-testid={`moderation-reason-modal-${id}`}>
      {view === "REASON" ? (
        <Reasons
          selected={reasonCode}
          onCode={(code) => {
            setReasonCode(code);
            setView("EXPLANATION");
          }}
        />
      ) : (
        <DetailedExplanation
          onBack={() => setView("REASON")}
          code={reasonCode!}
          value={detailedExplanation}
          onChange={setDetailedExplanation}
        />
      )}

      <Flex marginTop={2} direction="column">
        {reasonCode && (
          <Flex>
            <Localized id="common-moderationReason-reject">
              <Button
                className={styles.rejectButton}
                disabled={
                  reasonCode === null ||
                  (reasonCode === GQLREJECTION_REASON_CODE.OTHER &&
                    !detailedExplanation)
                }
                onClick={submitReason}
                color="alert"
                fullWidth
              >
                Reject
              </Button>
            </Localized>
          </Flex>
        )}

        <Flex>
          <Localized id="common-moderationReason-cancel">
            <Button
              variant="outlined"
              color="mono"
              onClick={onCancel}
              fullWidth
            >
              Cancel
            </Button>
          </Localized>
        </Flex>
      </Flex>
    </Box>
  );
};

export default ModerationReason;

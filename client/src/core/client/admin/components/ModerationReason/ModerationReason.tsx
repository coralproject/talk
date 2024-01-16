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
  linkClassName?: string;
}

const ModerationReason: FunctionComponent<Props> = ({
  onCancel,
  onReason,
  id,
  linkClassName,
}) => {
  const [view, setView] = useState<"REASON" | "EXPLANATION">("REASON");
  const [reasonCode, setReasonCode] = useState<ReasonCode | null>(null);

  const [detailedExplanation, setDetailedExplanation] = useState<string | null>(
    null
  );
  const [otherCustomReason, setOtherCustomReason] = useState<string | null>(
    null
  );

  const submitReason = useCallback(() => {
    onReason({
      code: reasonCode!,
      detailedExplanation: detailedExplanation || undefined,
      customReason: otherCustomReason || undefined,
    });
  }, [reasonCode, detailedExplanation, onReason, otherCustomReason]);

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
          onBack={() => {
            setView("REASON");
            setReasonCode(null);
          }}
          code={reasonCode!}
          explanationValue={detailedExplanation}
          onChangeExplanation={setDetailedExplanation}
          customReasonValue={otherCustomReason}
          onChangeCustomReason={setOtherCustomReason}
          linkClassName={linkClassName}
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
                    !otherCustomReason)
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

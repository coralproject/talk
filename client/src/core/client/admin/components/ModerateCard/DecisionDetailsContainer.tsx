// import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { Flex, HorizontalGutter, Timestamp } from "coral-ui/components/v2";

import { DecisionDetailsContainer_comment } from "coral-admin/__generated__/DecisionDetailsContainer_comment.graphql";

import styles from "./DecisionDetailsContainer.css";
import { unsnake } from "../ModerationReason/formatting";

interface Props {
  comment: DecisionDetailsContainer_comment;
}

const DecisionDetailsContainer: FunctionComponent<Props> = ({ comment }) => {
  const statusHistory = comment.statusHistory.edges[0].node;

  return (
    <HorizontalGutter className={styles.wrapper} padding={3}>
      <Flex>
        <Flex direction="column" className={styles.full}>
          <div className={styles.label}>Decision</div>
          <div className={styles.rejected}>Rejected</div>
        </Flex>
        {statusHistory.rejectionReason && statusHistory.rejectionReason.code && (
          <Flex direction="column" className={styles.full}>
            <div className={styles.label}>Reason</div>
            <div className={styles.info}>
              {unsnake(statusHistory.rejectionReason.code)}
            </div>
          </Flex>
        )}
      </Flex>
      {statusHistory.rejectionReason?.legalGrounds && (
        <Flex direction="column">
          <div className={styles.label}>Law broken</div>
          <div className={styles.info}>
            {statusHistory.rejectionReason?.legalGrounds}
          </div>
        </Flex>
      )}
      {statusHistory.rejectionReason?.customReason && (
        <Flex direction="column">
          <div className={styles.label}>Custom reason</div>
          <div className={styles.info}>
            {statusHistory.rejectionReason?.customReason}
          </div>
        </Flex>
      )}
      {statusHistory.rejectionReason?.detailedExplanation && (
        <Flex direction="column">
          <div className={styles.label}>Detailed explanation</div>
          <div className={styles.info}>
            {statusHistory.rejectionReason?.detailedExplanation}
          </div>
        </Flex>
      )}
      <Flex>
        <div className={styles.label}>
          <Timestamp>{statusHistory.createdAt}</Timestamp>
        </div>
      </Flex>
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment DecisionDetailsContainer_comment on Comment {
      id
      statusHistory(first: 1) {
        edges {
          node {
            createdAt
            status
            rejectionReason {
              code
              legalGrounds
              detailedExplanation
              customReason
            }
          }
        }
      }
    }
  `,
})(DecisionDetailsContainer);

export default enhanced;

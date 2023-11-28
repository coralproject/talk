// import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { Flex, HorizontalGutter } from "coral-ui/components/v2";

import { DecisionDetailsContainer_comment } from "coral-admin/__generated__/DecisionDetailsContainer_comment.graphql";

import styles from "./DecisionDetailsContainer.css";

interface Props {
  comment: DecisionDetailsContainer_comment;
}

const DecisionDetailsContainer: FunctionComponent<Props> = ({ comment }) => {
  const statusHistory = comment.statusHistory.edges[0].node;
  return (
    <HorizontalGutter className={styles.wrapper} padding={2}>
      <Flex>
        <Flex direction="column" className={styles.full}>
          <div className={styles.label}>Decision</div>
          <div>Rejected</div>
        </Flex>
        <Flex direction="column" className={styles.full}>
          <div className={styles.label}>Reason</div>
          <div>{statusHistory.rejectionReason?.code}</div>
        </Flex>
      </Flex>
      {statusHistory.rejectionReason?.detailedExplanation && (
        <Flex direction="column">
          <div className={styles.label}>Detailed explanation</div>
          <div>{statusHistory.rejectionReason?.detailedExplanation}</div>
        </Flex>
      )}
      <Flex>
        <div className={styles.label}>{statusHistory.createdAt}</div>
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
            }
          }
        }
      }
    }
  `,
})(DecisionDetailsContainer);

export default enhanced;

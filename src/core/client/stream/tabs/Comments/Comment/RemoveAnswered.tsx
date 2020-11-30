import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { useLocal, useMutation } from "coral-framework/lib/relay";
import { Button } from "coral-ui/components/v2";

import { RemoveAnsweredLocal } from "coral-stream/__generated__/RemoveAnsweredLocal.graphql";

import { RemoveAnsweredMutation } from "./RemoveAnsweredMutation";

import styles from "./RemoveAnswered.css";

interface Props {
  commentID: string;
  storyID: string;
}

const RemoveAnswered: FunctionComponent<Props> = ({ commentID, storyID }) => {
  const removeAnswered = useMutation(RemoveAnsweredMutation);

  const [{ commentsOrderBy }] = useLocal<RemoveAnsweredLocal>(graphql`
    fragment RemoveAnsweredLocal on Local {
      commentsOrderBy
    }
  `);

  const onRemove = useCallback(async () => {
    await removeAnswered({ commentID, storyID, orderBy: commentsOrderBy });
  }, [commentID, commentsOrderBy, removeAnswered, storyID]);

  return (
    <>
      <Localized id="qa-unansweredTab-doneAnswering">
        <Button
          variant="regular"
          color="regular"
          className={styles.removeAnswered}
          onClick={onRemove}
        >
          Done
        </Button>
      </Localized>
    </>
  );
};

export default RemoveAnswered;

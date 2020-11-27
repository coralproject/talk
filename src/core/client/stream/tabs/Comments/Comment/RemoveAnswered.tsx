import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";

import { useMutation } from "coral-framework/lib/relay";
// import { useCoralContext } from "coral-framework/lib/bootstrap";
import { Button } from "coral-ui/components/v2";

import { RemoveAnsweredMutation } from "./RemoveAnsweredMutation";

import styles from "./RemoveAnswered.css";

interface Props {
  commentID: string;
  storyID: string;
}

const RemoveAnswered: FunctionComponent<Props> = ({ commentID, storyID }) => {
  const removeAnswered = useMutation(RemoveAnsweredMutation);

  const onRemove = useCallback(async () => {
    await removeAnswered({ commentID, storyID });
  }, [commentID, removeAnswered, storyID]);

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

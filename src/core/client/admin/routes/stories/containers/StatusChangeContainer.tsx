import React, { StatelessComponent, useCallback } from "react";

import { CloseStoryMutation, OpenStoryMutation } from "talk-admin/mutations";
import { GQLSTORY_STATUS, GQLSTORY_STATUS_RL } from "talk-framework/schema";

import { MutationProp, withMutation } from "talk-framework/lib/relay";
import StatusChange from "../components/StatusChange";

interface Props {
  storyID: string;
  status: GQLSTORY_STATUS_RL;
  openStory: MutationProp<typeof OpenStoryMutation>;
  closeStory: MutationProp<typeof CloseStoryMutation>;
}

const StatusChangeContainer: StatelessComponent<Props> = props => {
  const handleChangeStatus = useCallback(
    (status: GQLSTORY_STATUS_RL) => {
      if (props.status === status) {
        return;
      }
      if (status === GQLSTORY_STATUS.CLOSED) {
        props.closeStory({ id: props.storyID });
      } else if (status === GQLSTORY_STATUS.OPEN) {
        props.openStory({ id: props.storyID });
      }
    },
    [props.storyID, props.closeStory, props.openStory, props.status]
  );
  return (
    <StatusChange onChangeStatus={handleChangeStatus} status={props.status} />
  );
};

const enhanced = withMutation(OpenStoryMutation)(
  withMutation(CloseStoryMutation)(StatusChangeContainer)
);

export default enhanced;

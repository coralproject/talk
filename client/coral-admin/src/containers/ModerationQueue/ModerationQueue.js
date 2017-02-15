import React, {PropTypes} from 'react';

import Comment from './components/Comment';
import {actionsMap} from './helpers/moderationQueueActionsMap';

const ModerationQueue = ({activeTab = 'premod', ...props}) => {
  return (
    <div id="moderationList">
      <ul>
      {
        props.data[activeTab].map((comment, i) => {
          const status = comment.action_summaries ? 'FLAGGED' : comment.status;
          return <Comment
            key={i}
            index={i}
            comment={comment}
            suspectWords={props.suspectWords}
            actions={actionsMap[status]}
            showBanUserDialog={props.showBanUserDialog}
            acceptComment={props.acceptComment}
            rejectComment={props.rejectComment}
            currentAsset={props.currentAsset}
          />;
        })
      }
      </ul>
    </div>
  );
};

ModerationQueue.propTypes = {
  data: PropTypes.object.isRequired
};

export default ModerationQueue;

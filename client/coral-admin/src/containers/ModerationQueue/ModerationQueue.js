import React, {PropTypes} from 'react';

import Comment from './components/Comment';
import {actionsMap} from './helpers/moderationQueueActionsMap';

const ModerationQueue = props => {
  return (
    <div>
      <ul>
      {
        props.data[props.activeTab].map((comment, i) => {
          return <Comment
            key={i}
            index={i}
            comment={comment}
            suspectWords={props.suspectWords}
            actions={actionsMap[comment.status]}
            showBanUserDialog={props.showBanUserDialog}
            acceptComment={props.acceptComment}
            rejectComment={props.rejectComment}
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

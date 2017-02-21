import React, {PropTypes} from 'react';

import Comment from './components/Comment';
import EmptyCard from '../../components/EmptyCard';
import {actionsMap} from './helpers/moderationQueueActionsMap';

const ModerationQueue = ({activeTab = 'premod', ...props}) => {
  const areComments = props.data[activeTab].length;
  return (
    <div id="moderationList">
      <ul style={{paddingLeft: 0}}>
      {
        areComments
        ? props.data[activeTab].map((comment, i) => {
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
        : <EmptyCard>No more comments to moderate! You're all caught up. Go have some ☕️</EmptyCard>
      }
      </ul>
    </div>
  );
};

ModerationQueue.propTypes = {
  data: PropTypes.object.isRequired,
  acceptComment: PropTypes.func.isRequired,
  rejectComment: PropTypes.func.isRequired,
  showBanUserDialog: PropTypes.func.isRequired,
  currentAsset: PropTypes.object,
  suspectWords: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ModerationQueue;

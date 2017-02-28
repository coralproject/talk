import React, {PropTypes} from 'react';

import Comment from './components/Comment';
import EmptyCard from '../../components/EmptyCard';
import {actionsMap} from './helpers/moderationQueueActionsMap';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-admin/src/translations';

const lang = new I18n(translations);
const ModerationQueue = ({comments, ...props}) => {
  return (
    <div id="moderationList">
      <ul style={{paddingLeft: 0}}>
      {
        comments.length
        ? comments.map((comment, i) => {
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
        : <EmptyCard>{lang.t('modqueue.emptyqueue')}</EmptyCard>
      }
      </ul>
    </div>
  );
};

ModerationQueue.propTypes = {
  suspectWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentAsset: PropTypes.object,
  showBanUserDialog: PropTypes.func.isRequired,
  rejectComment: PropTypes.func.isRequired,
  acceptComment: PropTypes.func.isRequired,
  comments: PropTypes.array.isRequired
};

export default ModerationQueue;

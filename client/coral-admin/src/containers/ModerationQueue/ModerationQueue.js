import React, {PropTypes} from 'react';

import Comment from './components/Comment';
import styles from './components/styles.css';
import EmptyCard from '../../components/EmptyCard';
import {actionsMap} from './helpers/moderationQueueActionsMap';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-admin/src/translations';
import LoadMore from './components/LoadMore';

const lang = new I18n(translations);
const ModerationQueue = ({comments, selectedIndex, commentCount, singleView, loadMore, activeTab, sort, ...props}) => {
  return (
    <div id="moderationList" className={`${styles.list} ${singleView ? styles.singleView : ''}`}>
      <ul style={{paddingLeft: 0}}>
      {
        comments.length
        ? comments.map((comment, i) => {
          const status = comment.action_summaries ? 'FLAGGED' : comment.status;
          return <Comment
            key={i}
            index={i}
            comment={comment}
            selected={i === selectedIndex}
            suspectWords={props.suspectWords}
            bannedWords={props.bannedWords}
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
      <LoadMore
        comments={comments}
        loadMore={loadMore}
        sort={sort}
        tab={activeTab}
        showLoadMore={comments.length < commentCount}
        assetId={props.assetId}
        />
    </div>
  );
};

ModerationQueue.propTypes = {
  bannedWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  suspectWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentAsset: PropTypes.object,
  showBanUserDialog: PropTypes.func.isRequired,
  rejectComment: PropTypes.func.isRequired,
  acceptComment: PropTypes.func.isRequired,
  comments: PropTypes.array.isRequired
};

export default ModerationQueue;

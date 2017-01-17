import React from 'react';
import styles from './ModerationQueue.css';

import ModerationKeysModal from 'components/ModerationKeysModal';
import CommentList from 'components/CommentList';
import BanUserDialog from 'components/BanUserDialog';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../translations.json';

const lang = new I18n(translations);

export default ({onTabClick, ...props}) => (
  <div>
    <div className='mdl-tabs'>
      <div className={`mdl-tabs__tab-bar ${styles.tabBar}`}>
        <a href='#pending'
           onClick={(e) => {
             e.preventDefault();
             onTabClick('pending');
           }}
           className={`mdl-tabs__tab ${styles.tab} ${props.activeTab === 'pending' ? styles.active : ''}`}
        >
          {lang.t('modqueue.pending')}
        </a>
        <a href='#rejected'
           onClick={(e) => {
             e.preventDefault();
             onTabClick('rejected');
           }}
           className={`mdl-tabs__tab ${styles.tab} ${props.activeTab === 'rejected' ? styles.active : ''}`}
        >
          {lang.t('modqueue.rejected')}
        </a>
        <a href='#flagged'
           onClick={(e) => {
             e.preventDefault();
             onTabClick('flagged');
           }}
           className={`mdl-tabs__tab ${styles.tab} ${props.activeTab === 'flagged' ? styles.active : ''}`}
        >
          {lang.t('modqueue.flagged')}
        </a>
      </div>
      <div className={`mdl-tabs__panel is-active ${styles.listContainer}`} id='pending'>
        {
          props.activeTab === 'pending'
          ? <div>
              <CommentList
                suspectWords={props.settings.settings.wordlist.suspect}
                isActive={props.activeTab === 'pending'}
                singleView={props.singleView}
                commentIds={props.premodIds}
                comments={props.comments.byId}
                users={props.users.byId}
                onClickAction={props.updateStatus}
                onClickShowBanDialog={props.showBanUserDialog}
                modActions={['reject', 'approve', 'ban']}
                loading={props.comments.loading} />
              <BanUserDialog
                open={props.comments.showBanUserDialog}
                handleClose={props.hideBanUserDialog}
                onClickBanUser={props.banUser}
                user={props.comments.banUser} />
            </div>
          : null
        }
      </div>
      <div className={`mdl-tabs__panel ${styles.listContainer}`} id='rejected'>
      {
        props.activeTab === 'rejected'
        ? <CommentList
            suspectWords={props.settings.settings.wordlist.suspect}
            isActive={props.activeTab === 'rejected'}
            singleView={props.singleView}
            commentIds={props.rejectedIds}
            comments={props.comments.byId}
            users={props.users.byId}
            onClickAction={props.updateStatus}
            modActions={['approve']}
            loading={props.comments.loading} />
        : null
      }
      </div>
      <div className={`mdl-tabs__panel ${styles.listContainer}`} id='flagged'>
      {
        props.activeTab === 'flagged'
        ? <CommentList
            suspectWords={props.settings.settings.wordlist.suspect}
            isActive={props.activeTab === 'flagged'}
            singleView={props.singleView}
            commentIds={props.flaggedIds}
            comments={props.comments.byId}
            users={props.users.byId}
            onClickAction={props.updateStatus}
            modActions={['reject', 'approve']}
            loading={props.comments.loading} />
        : null
      }
       </div>
      <ModerationKeysModal open={props.modalOpen} onClose={props.closeModal} />
    </div>
  </div>
);

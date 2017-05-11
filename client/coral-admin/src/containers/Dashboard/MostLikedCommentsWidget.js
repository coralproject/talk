import React from 'react';
import I18n from 'coral-i18n/modules/i18n/i18n';

import ModerationQueue from 'coral-admin/src/containers/ModerationQueue/ModerationQueue';
import styles from './Widget.css';
import BanUserDialog from 'coral-admin/src/components/BanUserDialog';

const lang = new I18n();

const MostLikedCommentsWidget = props => {
  const {
    comments,
    moderation,
    settings,
    handleBanUser,
    showBanUserDialog,
    hideBanUserDialog,
    acceptComment,
    rejectComment
  } = props;

  return (
    <div className={styles.widget}>
      <h2 className={styles.heading}>{lang.t('most_liked_comments')}</h2>
      <ModerationQueue
        comments={comments}
        suspectWords={settings.wordlist.suspect}
        showBanUserDialog={showBanUserDialog}
        acceptComment={acceptComment}
        rejectComment={rejectComment} />
      <BanUserDialog
        open={moderation.banDialog}
        user={moderation.user}
        handleClose={hideBanUserDialog}
        handleBanUser={handleBanUser} />
    </div>
  );
};

export default MostLikedCommentsWidget;

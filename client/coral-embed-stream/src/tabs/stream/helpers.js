import t from 'coral-framework/services/i18n';

const notifyReasons = ['LINKS', 'TRUST'];

function shouldNotify(actions = []) {
  return actions.some(
    ({ __typename, reason }) =>
      __typename === 'FlagAction' && notifyReasons.includes(reason)
  );
}

// Given a newly posted or edited comment's status, show a notification to the user
// if needed
export const notifyForNewCommentStatus = (notify, status, actions) => {
  if (status === 'REJECTED') {
    notify('error', t('comment_box.comment_post_banned_word'));
  } else if (
    status === 'PREMOD' ||
    (status === 'SYSTEM_WITHHELD' && shouldNotify(actions))
  ) {
    notify('success', t('comment_box.comment_post_notif_premod'));
  }
};

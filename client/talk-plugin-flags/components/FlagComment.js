import React from 'react';
import FlagButton from './FlagButton';

import t from 'coral-framework/services/i18n';
import { username, comment } from '../helpers/flagReasons';

const FlagComment = props => (
  <FlagButton {...props} getPopupMenu={getPopupMenu} />
);

const getPopupMenu = [
  () => {
    return {
      header: t('step_1_header'),
      options: [
        { val: 'COMMENTS', text: t('flag_comment') },
        { val: 'USERS', text: t('flag_username') },
      ],
      button: t('continue'),
      sets: 'itemType',
    };
  },
  itemType => {
    const options =
      itemType === 'COMMENTS'
        ? [
            { val: comment.offensive, text: t('comment_offensive') },
            { val: comment.spam, text: t('marketing') },
            { val: comment.noagree, text: t('no_agree_comment') },
            { val: comment.other, text: t('other') },
          ]
        : [
            { val: username.offensive, text: t('username_offensive') },
            { val: username.nolike, text: t('no_like_username') },
            { val: username.impersonating, text: t('user_impersonating') },
            { val: username.spam, text: t('marketing') },
            { val: username.other, text: t('other') },
          ];
    return {
      header: t('step_2_header'),
      options,
      button: t('continue'),
      sets: 'reason',
    };
  },
  () => {
    return {
      header: t('step_3_header'),
      text: t('thank_you'),
      button: t('done'),
    };
  },
];

export default FlagComment;

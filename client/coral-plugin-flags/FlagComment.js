import React from 'react';
import FlagButton from './FlagButton';

import t from 'coral-i18n/services/i18n';

const FlagComment = (props) => <FlagButton {...props} getPopupMenu={getPopupMenu} />;

const getPopupMenu = [
  () => {
    return {
      header: t('step_1_header'),
      options: [
        {val: 'COMMENTS', text: t('flag_comment')},
        {val: 'USERS', text: t('flag_username')}
      ],
      button: t('continue'),
      sets: 'itemType'
    };
  },
  (itemType) => {
    const options = itemType === 'COMMENTS' ?
    [
      {val: 'This comment is offensive', text: t('comment_offensive')},
      {val: 'This looks like an ad/marketing', text: t('marketing')},
      {val: 'I don\'t agree with this comment', text: t('no_agree_comment')},
      {val: 'Other', text: t('other')}
    ]
    : [
      {val: 'This username is offensive', text: t('username_offensive')},
      {val: 'I don\'t like this username', text: t('no_like_username')},
      {val: 'This user is impersonating', text: t('user_impersonating')},
      {val: 'This looks like an ad/marketing', text: t('marketing')},
      {val: 'Other', text: t('other')}
    ];
    return {
      header: t('step_2_header'),
      options,
      button: t('continue'),
      sets: 'reason'
    };
  },
  () =>  {
    return {
      header: t('step_3_header'),
      text: t('thank_you'),
      button: t('done'),
    };
  }
];

export default FlagComment;

import React from 'react';
import FlagButton from './FlagButton';
import I18n from 'coral-i18n/modules/i18n/i18n';

const lang = new I18n();

const FlagComment = (props) => <FlagButton {...props} getPopupMenu={getPopupMenu} />;

const getPopupMenu = [
  () => {
    return {
      header: lang.t('step-1-header'),
      options: [
        {val: 'COMMENTS', text: lang.t('flag_comment')},
        {val: 'USERS', text: lang.t('flag_username')}
      ],
      button: lang.t('continue'),
      sets: 'itemType'
    };
  },
  (itemType) => {
    const options = itemType === 'COMMENTS' ?
    [
      {val: 'This comment is offensive', text: lang.t('comment_offensive')},
      {val: 'This looks like an ad/marketing', text: lang.t('marketing')},
      {val: 'I don\'t agree with this comment', text: lang.t('no-agree-comment')},
      {val: 'Other', text: lang.t('other')}
    ]
    : [
      {val: 'This username is offensive', text: lang.t('username-offensive')},
      {val: 'I don\'t like this username', text: lang.t('no-like-username')},
      {val: 'This user is impersonating', text: lang.t('user-impersonating')},
      {val: 'This looks like an ad/marketing', text: lang.t('marketing')},
      {val: 'Other', text: lang.t('other')}
    ];
    return {
      header: lang.t('step-2-header'),
      options,
      button: lang.t('continue'),
      sets: 'reason'
    };
  },
  () =>  {
    return {
      header: lang.t('step-3-header'),
      text: lang.t('thank-you'),
      button: lang.t('done'),
    };
  }
];

export default FlagComment;

import React from 'react';
import FlagButton from './FlagButton';
import {I18n} from '../coral-framework';
import translations from './translations.json';

const FlagBio = (props) => <FlagButton {...props} getPopupMenu={getPopupMenu} />;

const getPopupMenu = [
  () => {
    return {
      header: lang.t('step-2-header'),
      itemType: 'user',
      field: 'bio',
      options: [
        {val: 'This bio is offensive', text: lang.t('bio-offensive')},
        {val: 'I don\'t like this bio', text: lang.t('no-like-bio')},
        {val: 'This looks like an ad/marketing', text: lang.t('marketing')},
        {val: 'other', text: lang.t('other')}
      ],
      button: lang.t('continue'),
      sets: 'detail'
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

export default FlagBio;

const lang = new I18n(translations);

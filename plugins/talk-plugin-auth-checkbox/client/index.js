import TermsAndConditionsField from './components/TermsAndConditionsField';
import translations from './translations.yml';

export default {
  slots: {
    'talkPluginAuth.formField': [TermsAndConditionsField],
  },
  translations,
};

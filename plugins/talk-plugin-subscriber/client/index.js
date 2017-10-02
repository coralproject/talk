import SubscriberBadge from './containers/SubscriberBadge';
import translations from './translations.yml';
import {gql} from 'react-apollo';

export default {
  translations,
  slots: {
    commentAuthorTags: [SubscriberBadge]
  }
};
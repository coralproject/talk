import {gql} from 'react-apollo';
import * as mutations from './mutations';

function createDefaultResponseFragments() {
  const names = Object.keys(mutations).map((key) => key.replace('with', ''));
  const result = {};
  names.forEach((name) => {
    const response = `${name}Response`;
    result[response] = gql`
      fragment Coral_${response} on ${response} {
        errors {
          translation_key
        }
      }
    `;
  });
  return result;
}

// fragments defined here are automatically registered.
export default {
  ...createDefaultResponseFragments()
};

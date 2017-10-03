import ModTag from '../components/ModTag';
import {withTags} from 'plugin-api/beta/client/hocs';
import {gql} from 'react-apollo';

const fragments = {
  comment: gql`
    fragment TalkFeaturedComments_ModTag_comment on Comment {
      user {
        username
      }
    }
  `
};

export default withTags('featured', {fragments})(ModTag);


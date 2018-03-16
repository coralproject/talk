import { gql } from 'react-apollo';
import ShareButton from '../components/ShareButton';
import { withFragments } from 'plugin-api/beta/client/hocs';

export default withFragments({
  asset: gql`
    fragment TalkShare_Button_asset on Asset {
      url
    }
  `,
  comment: gql`
    fragment TalkShare_Button_comment on Comment {
      id
    }
  `,
})(ShareButton);

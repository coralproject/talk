import { gql } from 'react-apollo';
import PermalinkButton from '../components/PermalinkButton';
import { withFragments } from 'plugin-api/beta/client/hocs';

export default withFragments({
  asset: gql`
    fragment TalkPermalink_Button_asset on Asset {
      url
    }
  `,
  comment: gql`
    fragment TalkPermalink_Button_comment on Comment {
      id
    }
  `,
})(PermalinkButton);

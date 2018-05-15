import { gql } from 'react-apollo';
import withQuery from 'coral-framework/hocs/withQuery';
import Header from '../components/Header';
import CommunityIndicator from '../routes/Community/containers/Indicator';
// TODO: eventually we will readd modqueue counts
// import ModerationIndicator from '../routes/Moderation/containers/Indicator';
import { getDefinitionName } from 'coral-framework/utils';

export default withQuery(
  gql`
    query TalkAdmin_Header {
      ...${getDefinitionName(CommunityIndicator.fragments.root)}
    }
    ${CommunityIndicator.fragments.root}
  `,
  {
    options: {
      // variables: { nullID: null },
    },
  }
)(Header);

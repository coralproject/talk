import { gql } from 'react-apollo';
import withQuery from 'coral-framework/hocs/withQuery';
import Header from '../components/Header';
import CommunityIndicator from '../routes/Community/containers/Indicator';
import ModerationIndicator from '../routes/Moderation/containers/Indicator';
import { getDefinitionName } from 'coral-framework/utils';

export default withQuery(
  gql`
    query TalkAdmin_Header {
      ...${getDefinitionName(ModerationIndicator.fragments.root)}
      ...${getDefinitionName(CommunityIndicator.fragments.root)}
    }
    ${ModerationIndicator.fragments.root}
    ${CommunityIndicator.fragments.root}
  `,
  {
    options: {
      pollInterval: 10000,
    },
  }
)(Header);

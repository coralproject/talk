import {gql} from 'react-apollo';
import withFragments from 'coral-framework/hocs/withFragments';
import Header from '../components/ui/Header';

export default withFragments({
  root: gql`
    fragment TalkAdmin_Header on RootQuery {
      premodCount: commentCount(query: {statuses: [PREMOD]})
      reportedCount: commentCount(query: {statuses: [NONE, PREMOD, SYSTEM_WITHHELD], action_type: FLAG})
      flaggedUsernamesCount: userCount(query: {
        action_type: FLAG,
        statuses: [PENDING]
      })
    }
  `
})(Header);

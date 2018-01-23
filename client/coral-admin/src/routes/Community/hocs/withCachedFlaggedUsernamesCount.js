import { compose, gql } from 'react-apollo';
import { mapProps } from 'recompose';
import withQuery from 'coral-framework/hocs/withQuery';
import get from 'lodash/get';

const withData = withQuery(
  gql`
    query TalkAdmin_CommunityMenu {
      flaggedUsernamesCount: userCount(
        query: {
          action_type: FLAG
          state: { status: { username: [SET, CHANGED] } }
        }
      )
    }
  `,
  {
    options: {
      fetchPolicy: 'cache-only',
    },
  }
);

export default compose(
  withData,
  mapProps(ownProps => ({
    flaggedUsernamesCount: get(ownProps, 'root.flaggedUsernamesCount'),
  }))
);

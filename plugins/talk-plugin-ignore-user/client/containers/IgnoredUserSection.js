import React from 'react';
import IgnoredUserSection from '../components/IgnoredUserSection';
import { compose, gql } from 'react-apollo';
import {
  withFragments,
  excludeIf,
  withStopIgnoringUser,
} from 'plugin-api/beta/client/hocs';

class IgnoredUserSectionContainer extends React.Component {
  render() {
    return (
      <IgnoredUserSection
        stopIgnoringUser={this.props.stopIgnoringUser}
        ignoredUsers={this.props.root.me.ignoredUsers}
      />
    );
  }
}

const withIgnoredUserSectionFragments = withFragments({
  root: gql`
    fragment TalkIgnoreUser_IgnoredUserSection_root on RootQuery {
      me {
        id
        ignoredUsers {
          id
          username
        }
      }
    }
  `,
});

const enhance = compose(
  withIgnoredUserSectionFragments,
  withStopIgnoringUser,
  excludeIf(({ root: { me } }) => me.ignoredUsers.length === 0)
);

export default enhance(IgnoredUserSectionContainer);

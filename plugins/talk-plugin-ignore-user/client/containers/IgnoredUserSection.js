import React from 'react';
import PropTypes from 'prop-types';
import IgnoredUserSection from '../components/IgnoredUserSection';
import { compose, gql } from 'react-apollo';
import {
  withFragments,
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

IgnoredUserSectionContainer.propTypes = {
  stopIgnoringUser: PropTypes.func.isRequired,
  root: PropTypes.object.isRequired,
};

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
  withStopIgnoringUser
);

export default enhance(IgnoredUserSectionContainer);

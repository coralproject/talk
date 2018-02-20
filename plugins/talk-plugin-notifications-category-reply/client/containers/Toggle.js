import React from 'react';
import PropTypes from 'prop-types';
import { compose, gql } from 'react-apollo';
import Toggle from '../components/Toggle';
import { withFragments } from 'plugin-api/beta/client/hocs';

class ToggleContainer extends React.Component {
  render() {
    return <Toggle checked={this.props.root.me.notificationSettings.onReply} />;
  }
}

ToggleContainer.propTypes = {
  data: PropTypes.object,
  root: PropTypes.object,
};

const enhance = compose(
  withFragments({
    root: gql`
      fragment TalkNotificationsCategoryReply_Toggle_root on RootQuery {
        me {
          notificationSettings {
            onReply
          }
        }
      }
    `,
  })
);

export default enhance(ToggleContainer);

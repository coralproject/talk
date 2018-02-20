import React from 'react';
import PropTypes from 'prop-types';
import { compose, gql } from 'react-apollo';
import Settings from '../components/Settings';
import { withFragments } from 'plugin-api/beta/client/hocs';
import { getSlotFragmentSpreads } from 'plugin-api/beta/client/utils';

const slots = ['notificationSettings'];

class SettingsContainer extends React.Component {
  render() {
    return <Settings data={this.props.data} root={this.props.root} />;
  }
}

SettingsContainer.propTypes = {
  data: PropTypes.object,
  root: PropTypes.object,
};

const enhance = compose(
  withFragments({
    root: gql`
      fragment TalkNotifications_Settings_root on RootQuery {
        __typename
        ${getSlotFragmentSpreads(slots, 'root')}
      }
    `,
  })
);

export default enhance(SettingsContainer);

import React from 'react';
import PropTypes from 'prop-types';
import { compose, gql } from 'react-apollo';
import Settings from '../components/Settings';
import { withFragments } from 'plugin-api/beta/client/hocs';
import { getSlotFragmentSpreads } from 'plugin-api/beta/client/utils';
import { withUpdateNotificationSettings } from '../mutations';

const slots = ['notificationSettings'];

class SettingsContainer extends React.Component {
  state = {
    hasNotifications: [],
    turnOffInput: {},
  };

  indicateOn = plugin =>
    this.setState({
      hasNotifications: this.state.hasNotifications.concat(plugin),
    });
  indicateOff = plugin =>
    this.setState({
      hasNotifications: this.state.hasNotifications.filter(i => i !== plugin),
    });
  setTurnOffInputFragment = fragment =>
    this.setState({
      turnOffInput: { ...this.state.turnOffInput, ...fragment },
    });

  turnOffAll = () => {
    this.props.updateNotificationSettings(this.state.turnOffInput);
  };

  render() {
    return (
      <Settings
        data={this.props.data}
        root={this.props.root}
        indicateOn={this.indicateOn}
        indicateOff={this.indicateOff}
        setTurnOffInputFragment={this.setTurnOffInputFragment}
        updateNotificationSettings={this.props.updateNotificationSettings}
        turnOffAll={this.turnOffAll}
        turnOffButtonDisabled={this.state.hasNotifications.length === 0}
      />
    );
  }
}

SettingsContainer.propTypes = {
  data: PropTypes.object,
  root: PropTypes.object,
  updateNotificationSettings: PropTypes.func.isRequired,
};

const enhance = compose(
  withFragments({
    root: gql`
      fragment TalkNotifications_Settings_root on RootQuery {
        __typename
        ${getSlotFragmentSpreads(slots, 'root')}
      }
    `,
  }),
  withUpdateNotificationSettings
);

export default enhance(SettingsContainer);

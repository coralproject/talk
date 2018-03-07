import React from 'react';
import PropTypes from 'prop-types';
import { compose, gql } from 'react-apollo';
import Settings from '../components/Settings';
import { withFragments, excludeIf } from 'plugin-api/beta/client/hocs';
import { getSlotFragmentSpreads } from 'plugin-api/beta/client/utils';
import { withUpdateNotificationSettings } from '../mutations';

const slots = ['notificationSettings'];

class SettingsContainer extends React.Component {
  state = {
    hasNotifications: [],
    turnOffInput: {},
  };

  indicateOn = plugin =>
    this.setState(state => ({
      hasNotifications: state.hasNotifications.concat(plugin),
    }));

  indicateOff = plugin =>
    this.setState(state => ({
      hasNotifications: state.hasNotifications.filter(i => i !== plugin),
    }));

  setTurnOffInputFragment = fragment =>
    this.setState(state => ({
      turnOffInput: { ...state.turnOffInput, ...fragment },
    }));

  turnOffAll = () => {
    this.props.updateNotificationSettings(this.state.turnOffInput);
  };

  getNeedEmailVerification() {
    return !this.props.root.me.profiles.some(
      profile => profile.provider === 'local' && profile.confirmedAt
    );
  }

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
        needEmailVerification={this.getNeedEmailVerification()}
        email={this.props.root.me.email}
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
        me {
          email
          profiles {
            provider
            ... on LocalUserProfile {
              confirmedAt
            }
          }
        }
      }
    `,
  }),
  excludeIf(
    props =>
      !props.root.me.profiles.some(profile => profile.provider === 'local')
  ),
  withUpdateNotificationSettings
);

export default enhance(SettingsContainer);

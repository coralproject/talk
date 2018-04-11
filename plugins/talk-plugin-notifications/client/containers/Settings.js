import React from 'react';
import PropTypes from 'prop-types';
import { compose, gql } from 'react-apollo';
import Settings from '../components/Settings';
import {
  withFragments,
  excludeIf,
  withEnumValues,
} from 'plugin-api/beta/client/hocs';
import { getSlotFragmentSpreads } from 'plugin-api/beta/client/utils';
import { withUpdateNotificationSettings } from '../mutations';
import { connect } from 'plugin-api/beta/client/hocs';
import { staticConfigSelector } from 'plugin-api/beta/client/selectors';

const slots = ['notificationSettings'];

class SettingsContainer extends React.Component {
  state = {
    hasNotifications: [],
    turnOffInput: {},
  };

  indicateOn = key =>
    this.setState(state => ({
      hasNotifications: state.hasNotifications.concat(key),
    }));

  indicateOff = key =>
    this.setState(state => ({
      hasNotifications: state.hasNotifications.filter(i => i !== key),
    }));

  setTurnOffInputFragment = fragment =>
    this.setState(state => ({
      turnOffInput: { ...state.turnOffInput, ...fragment },
    }));

  turnOffAll = () => {
    this.props.updateNotificationSettings(this.state.turnOffInput);
  };

  setDigestFrequency = digestFrequency => {
    this.props.updateNotificationSettings({ digestFrequency });
  };

  getNeedEmailVerification() {
    return (
      this.props.root.settings.notificationsRequireConfirmation &&
      !this.props.root.me.profiles.some(
        profile => profile.provider === 'local' && profile.confirmedAt
      )
    );
  }

  render() {
    return (
      <Settings
        root={this.props.root}
        indicateOn={this.indicateOn}
        indicateOff={this.indicateOff}
        setTurnOffInputFragment={this.setTurnOffInputFragment}
        updateNotificationSettings={this.props.updateNotificationSettings}
        turnOffAll={this.turnOffAll}
        needEmailVerification={this.getNeedEmailVerification()}
        email={this.props.root.me.email}
        digestFrequencyValues={this.props.digestFrequencyValues}
        digestFrequency={
          this.props.root.me.notificationSettings.digestFrequency
        }
        disableDigest={this.state.hasNotifications.length === 0}
        disableTurnoffButton={this.state.hasNotifications.length === 0}
        onChangeDigestFrequency={this.setDigestFrequency}
      />
    );
  }
}

SettingsContainer.propTypes = {
  root: PropTypes.object,
  updateNotificationSettings: PropTypes.func.isRequired,
  digestFrequencyValues: PropTypes.array.isRequired,
};

const enhance = compose(
  withFragments({
    root: gql`
      fragment TalkNotifications_Settings_root on RootQuery {
        __typename
        ${getSlotFragmentSpreads(slots, 'root')}
        me {
          notificationSettings {
            digestFrequency
          }
          email
          profiles {
            provider
            ... on LocalUserProfile {
              confirmedAt
            }
          }
        }
        settings {
          notificationsRequireConfirmation
        }
      }
    `,
  }),
  // Grab the static configuration from the redux store.
  connect(state => ({
    static: staticConfigSelector(state),
  })),
  excludeIf(
    props =>
      // If the environment variable for TALK_CLIENT_FORCE_NOTIFICATION_SETTINGS
      // is `TRUE`, then always show it.
      props.static.TALK_CLIENT_FORCE_NOTIFICATION_SETTINGS !== 'TRUE' &&
      // Only show the settings pane if we have a local profile otherwise.
      !props.root.me.profiles.some(profile => profile.provider === 'local')
  ),
  withUpdateNotificationSettings,
  withEnumValues('DIGEST_FREQUENCY', 'digestFrequencyValues')
);

export default enhance(SettingsContainer);

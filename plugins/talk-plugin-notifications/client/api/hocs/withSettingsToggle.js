import React from 'react';
import PropTypes from 'prop-types';
import { compose, gql } from 'react-apollo';
import {
  withFragments,
  withGraphQLExtension,
} from 'plugin-api/beta/client/hocs';

const createHOC = settingsName => WrappedComponent => {
  class WithSettingsToggle extends React.Component {
    constructor(props) {
      super(props);
      props.setTurnOffInputFragment({ [settingsName]: false });

      if (this.isChecked()) {
        props.indicateOn();
      }
    }

    componentWillReceiveProps(nextProps) {
      const prevSetting = this.isChecked(this.props);
      const nextSetting = this.isChecked(nextProps);
      if (prevSetting && !nextSetting) {
        nextProps.indicateOff();
      } else if (!prevSetting && nextSetting) {
        nextProps.indicateOn();
      }
    }

    isChecked = (props = this.props) =>
      props.root.me.notificationSettings[settingsName];

    toggle = () => {
      this.props.updateNotificationSettings({
        [settingsName]: !this.isChecked(),
      });
    };

    render() {
      return (
        <WrappedComponent
          checked={this.isChecked()}
          onChange={this.toggle}
          disabled={this.props.disabled}
        />
      );
    }
  }

  WithSettingsToggle.propTypes = {
    root: PropTypes.object,
    indicateOn: PropTypes.func.isRequired,
    indicateOff: PropTypes.func.isRequired,
    setTurnOffInputFragment: PropTypes.func.isRequired,
    updateNotificationSettings: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
  };

  return WithSettingsToggle;
};

/**
 * withSettingsToggle will add a boolean setting with the
 * name `settingsName` to notification settings and provide
 * the folliwng props:
 *
 * `checked: boolean`      Whether setting is on or off
 * `onChange: () => void`  Calling this will toggle the setting
 * `disabled: boolean`     Whether setting is disabled
 */
const withSettingsToggle = settingsName => {
  const extension = {
    mutations: {
      UpdateNotificationSettings: ({
        variables: { input },
        state: {
          auth: {
            user: { id },
          },
        },
      }) => ({
        update: proxy => {
          if (input[settingsName] === undefined) {
            return;
          }

          const fragment = gql`
            fragment TalkNotifications_Toggle_${settingsName}_Fragment on User {
              notificationSettings {
                ${settingsName}
              }
            }
          `;
          const fragmentId = `User_${id}`;
          const data = {
            __typename: 'User',
            notificationSettings: {
              __typename: 'NotificationSettings',
              [settingsName]: input[settingsName],
            },
          };
          proxy.writeFragment({ fragment, id: fragmentId, data });
        },
      }),
    },
  };

  return compose(
    withFragments({
      root: gql`
        fragment TalkNotifications_Toggle_${settingsName}_root on RootQuery {
          me {
            notificationSettings {
              ${settingsName}
            }
          }
        }
      `,
    }),
    withGraphQLExtension(extension),
    createHOC(settingsName)
  );
};

export default withSettingsToggle;

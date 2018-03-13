import React from 'react';
import PropTypes from 'prop-types';
import { compose, gql } from 'react-apollo';
import Toggle from 'talk-plugin-notifications/client/components/Toggle';
import { t } from 'plugin-api/beta/client/services';
import {
  withFragments,
  withGraphQLExtension,
} from 'plugin-api/beta/client/hocs';

class ToggleContainer extends React.Component {
  constructor(props) {
    super(props);
    props.setTurnOffInputFragment({ onReply: false });

    if (this.getOnReplySetting()) {
      props.indicateOn();
    }
  }

  componentWillReceiveProps(nextProps) {
    const prevSetting = this.getOnReplySetting(this.props);
    const nextSetting = this.getOnReplySetting(nextProps);
    if (prevSetting && !nextSetting) {
      nextProps.indicateOff();
    } else if (!prevSetting && nextSetting) {
      nextProps.indicateOn();
    }
  }

  getOnReplySetting = (props = this.props) =>
    props.root.me.notificationSettings.onReply;

  toggle = () => {
    this.props.updateNotificationSettings({
      onReply: !this.getOnReplySetting(),
    });
  };

  render() {
    return (
      <Toggle
        checked={this.getOnReplySetting()}
        onChange={this.toggle}
        disabled={this.props.disabled}
      >
        {t('talk-plugin-notifications-category-reply.toggle_description')}
      </Toggle>
    );
  }
}

ToggleContainer.propTypes = {
  data: PropTypes.object,
  root: PropTypes.object,
  indicateOn: PropTypes.func.isRequired,
  indicateOff: PropTypes.func.isRequired,
  setTurnOffInputFragment: PropTypes.func.isRequired,
  updateNotificationSettings: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

const extension = {
  mutations: {
    UpdateNotificationSettings: ({
      variables: { input },
      state: { auth: { user: { id } } },
    }) => ({
      update: proxy => {
        if (input.onReply === undefined) {
          return;
        }

        const fragment = gql`
          fragment TalkNotificationsCategoryReply_User_Fragment on User {
            notificationSettings {
              onReply
            }
          }
        `;
        const fragmentId = `User_${id}`;
        const data = {
          __typename: 'User',
          notificationSettings: {
            __typename: 'NotificationSettings',
            onReply: input.onReply,
          },
        };
        proxy.writeFragment({ fragment, id: fragmentId, data });
      },
    }),
  },
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
  }),
  withGraphQLExtension(extension)
);

export default enhance(ToggleContainer);

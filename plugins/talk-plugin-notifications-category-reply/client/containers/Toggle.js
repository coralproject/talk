import React from 'react';
import PropTypes from 'prop-types';
import { compose, gql } from 'react-apollo';
import Toggle from 'talk-plugin-notifications/client/components/Toggle';
import { t } from 'plugin-api/beta/client/services';
import { withFragments } from 'plugin-api/beta/client/hocs';

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

import React from 'react';
import PropTypes from 'prop-types';
import { compose, gql } from 'react-apollo';
import Toggle from 'talk-plugin-notifications/client/components/Toggle';
import { t } from 'plugin-api/beta/client/services';
import { withFragments } from 'plugin-api/beta/client/hocs';

class ToggleContainer extends React.Component {
  constructor(props) {
    super(props);
    props.setTurnOffInputFragment({ onFeatured: false });

    if (this.getOnFeaturedSetting()) {
      props.indicateOn();
    }
  }

  componentWillReceiveProps(nextProps) {
    const prevSetting = this.getOnFeaturedSetting(this.props);
    const nextSetting = this.getOnFeaturedSetting(nextProps);
    if (prevSetting && !nextSetting) {
      nextProps.indicateOff();
    } else if (!prevSetting && nextSetting) {
      nextProps.indicateOn();
    }
  }

  getOnFeaturedSetting = (props = this.props) =>
    props.root.me.notificationSettings.onFeatured;

  toggle = () => {
    this.props.updateNotificationSettings({
      onFeatured: !this.getOnFeaturedSetting(),
    });
  };

  render() {
    return (
      <Toggle
        checked={this.getOnFeaturedSetting()}
        onChange={this.toggle}
        disabled={this.props.disabled}
      >
        {t('talk-plugin-notifications-category-featured.toggle_description')}
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
      fragment TalkNotificationsCategoryFeatured_Toggle_root on RootQuery {
        me {
          notificationSettings {
            onFeatured
          }
        }
      }
    `,
  })
);

export default enhance(ToggleContainer);

import React from 'react';
import ConfigureCard from 'coral-framework/components/ConfigureCard';
import MarkdownEditor from 'coral-framework/components/MarkdownEditor';
import t from 'coral-framework/services/i18n';
import cn from 'classnames';
import styles from './styles.css';

const plugin = 'talk-plugin-global-switchoff';

class GlobalSwitchoff extends React.Component {
  updateGlobalSwitchoffEnable = () => {
    const updater = {
      globalSwitchoffEnable: {
        $set: !this.props.settings.globalSwitchoffEnable,
      },
    };
    this.props.updatePending({ updater });
  };

  updateGlobalSwitchoffMessage = () => {};

  render() {
    const { settings } = this.props;
    return (
      <ConfigureCard
        checked={settings.globalSwitchoffEnable}
        onCheckbox={this.updateGlobalSwitchoffEnable}
        title={t(plugin + '.setting_title')}
      >
        <p>{t(plugin + '.setting_desc')}</p>
        <div
          className={cn(
            styles.configSettingGlobalSwitchoff,
            settings.globalSwitchoffEnable ? null : styles.hidden
          )}
        >
          <MarkdownEditor
            className={styles.descriptionBox}
            onChange={this.updateGlobalSwitchoffMessage}
            value={settings.globalSwitchoffMessage}
          />
        </div>
      </ConfigureCard>
    );
  }
}

export default GlobalSwitchoff;

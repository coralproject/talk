import React from 'react';
import PropTypes from 'prop-types';
import Wordlist from './Wordlist';
import Slot from 'coral-framework/components/Slot';
import t from 'coral-framework/services/i18n';
import ConfigurePage from './ConfigurePage';
import ConfigureCard from 'coral-framework/components/ConfigureCard';

class ModerationSettings extends React.Component {
  updateModeration = () => {
    const updater = {
      moderation: {
        $set: this.props.settings.moderation === 'PRE' ? 'POST' : 'PRE',
      },
    };
    this.props.updatePending({ updater });
  };

  updateEmailConfirmation = () => {
    const updater = {
      requireEmailConfirmation: {
        $set: !this.props.settings.requireEmailConfirmation,
      },
    };
    this.props.updatePending({ updater });
  };

  updatePremodLinksEnable = () => {
    const updater = {
      premodLinksEnable: { $set: !this.props.settings.premodLinksEnable },
    };
    this.props.updatePending({ updater });
  };

  updateWordlist = (listName, list) => {
    this.props.updatePending({
      updater: {
        wordlist: {
          $apply: wordlist => {
            const changeSet = { [listName]: list };
            if (!wordlist) {
              return changeSet;
            }
            return {
              ...wordlist,
              ...changeSet,
            };
          },
        },
      },
    });
  };

  render() {
    const { settings, data, root, updatePending, errors } = this.props;

    return (
      <ConfigurePage title={t('configure.moderation_settings')}>
        <ConfigureCard
          checked={settings.requireEmailConfirmation}
          onCheckbox={this.updateEmailConfirmation}
          title={t('configure.require_email_verification')}
        >
          {t('configure.require_email_verification_text')}
        </ConfigureCard>
        <ConfigureCard
          checked={settings.moderation === 'PRE'}
          onCheckbox={this.updateModeration}
          title={t('configure.enable_pre_moderation')}
        >
          {t('configure.enable_pre_moderation_text')}
        </ConfigureCard>
        <ConfigureCard
          checked={settings.premodLinksEnable}
          onCheckbox={this.updatePremodLinksEnable}
          title={t('configure.enable_premod_links')}
        >
          {t('configure.enable_premod_links_text')}
        </ConfigureCard>
        <Wordlist
          bannedWords={settings.wordlist.banned}
          suspectWords={settings.wordlist.suspect}
          onChangeWordlist={this.updateWordlist}
        />
        <Slot
          fill="adminModerationSettings"
          data={data}
          queryData={{ root, settings }}
          updatePending={updatePending}
          errors={errors}
        />
      </ConfigurePage>
    );
  }
}

ModerationSettings.propTypes = {
  updatePending: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  root: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
};

export default ModerationSettings;

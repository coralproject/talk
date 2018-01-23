import React from 'react';
import { Button } from 'coral-ui';
import PropTypes from 'prop-types';
import t from 'coral-framework/services/i18n';
import cn from 'classnames';
import styles from './Settings.css';
import Configuration from 'coral-framework/components/StreamConfiguration';
import QuestionBoxBuilder from './QuestionBoxBuilder';
import Slot from 'coral-framework/components/Slot';

class Settings extends React.Component {
  render() {
    const {
      settings: {
        moderation,
        premodLinksEnable,
        questionBoxEnable,
        questionBoxContent,
        questionBoxIcon,
      },
      onToggleModeration,
      onTogglePremodLinks,
      onToggleQuestionBox,
      onQuestionBoxIconChange,
      onQuestionBoxContentChange,
      canSave,
      onApply,
      slotProps,
      queryData,
    } = this.props;
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <h3>{t('configure.title')}</h3>
          <Button
            type="submit"
            className={cn(
              styles.apply,
              'talk-embed-stream-configuration-submit-button'
            )}
            checked={canSave}
            cStyle={canSave ? 'green' : 'darkGrey'}
            onClick={onApply}
            disabled={!canSave}
          >
            {t('configure.apply')}
          </Button>
          <p className={styles.description}>{t('configure.description')}</p>
        </div>
        <div className={styles.list}>
          <Configuration
            checked={moderation === 'PRE'}
            title={t('configure.enable_premod')}
            description={t('configure.enable_premod_description')}
            onCheckbox={onToggleModeration}
          />
          <Configuration
            checked={premodLinksEnable}
            title={t('configure.enable_premod_links')}
            description={t('configure.enable_premod_description')}
            onCheckbox={onTogglePremodLinks}
          />
          <Configuration
            checked={questionBoxEnable}
            title={t('configure.enable_questionbox')}
            description={t('configure.enable_questionbox_description')}
            onCheckbox={onToggleQuestionBox}
          >
            {questionBoxEnable && (
              <div className={styles.questionBoxContainer}>
                <QuestionBoxBuilder
                  questionBoxIcon={questionBoxIcon}
                  questionBoxContent={questionBoxContent}
                  onIconChange={onQuestionBoxIconChange}
                  onContentChange={onQuestionBoxContentChange}
                />
              </div>
            )}
          </Configuration>
          <Slot fill="streamSettings" queryData={queryData} {...slotProps} />
        </div>
      </div>
    );
  }
}

Settings.propTypes = {
  queryData: PropTypes.object.isRequired,
  slotProps: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  canSave: PropTypes.bool.isRequired,
  onToggleModeration: PropTypes.func.isRequired,
  onTogglePremodLinks: PropTypes.func.isRequired,
  onToggleQuestionBox: PropTypes.func.isRequired,
  onQuestionBoxContentChange: PropTypes.func.isRequired,
  onQuestionBoxIconChange: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
};

export default Settings;

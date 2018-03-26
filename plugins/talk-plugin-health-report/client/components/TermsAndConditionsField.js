import React from 'react';
import { Checkbox } from 'plugin-api/beta/client/components/ui';
import { t } from 'plugin-api/beta/client/services';
import styles from './TermsAndConditionsField.css';
import cn from 'classnames';

const TermsLink = () => (
  <a
    className={styles.link}
    href={t('talk-plugin-health-report.terms-link')}
    target="_blank"
  >
    {t('talk-plugin-health-report.terms')}
  </a>
);

const PrivacyLink = () => (
  <a
    className={styles.link}
    href={t('talk-plugin-health-report.privacy-policy-link')}
    target="_blank"
  >
    {t('talk-plugin-health-report.privacy-policy')}
  </a>
);

class TermsAndConditionsField extends React.Component {
  state = { checked: false };
  id = 'terms-and-conditions';

  componentWillMount() {
    this.props.disableSubmitSignUpForm();
  }

  onChange = ({ target: { checked } }) => {
    if (checked) {
      this.setState(() => ({ checked }));
      this.props.enableSubmitSignUpForm();
    } else {
      this.setState(() => ({ checked }));
      this.props.disableSubmitSignUpForm();
    }
  };

  render() {
    return (
      <div
        className={cn(
          styles.fieldContainer,
          'talk-plugin-health-report-field-container'
        )}
      >
        <Checkbox
          checked={this.state.checked}
          className="talk-plugin-health-report-checkbox"
          onChange={this.onChange}
          id={this.id}
        />
        <label id={this.id} className="talk-plugin-health-report-label">
          {t('talk-plugin-health-report.copy')}
          <TermsLink />
          {t('talk-plugin-health-report.and')}
          <PrivacyLink />
          {t('talk-plugin-health-report.from')}
        </label>
      </div>
    );
  }
}

export default TermsAndConditionsField;

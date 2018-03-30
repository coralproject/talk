import React from 'react';
import { Checkbox } from 'plugin-api/beta/client/components/ui';
import { t } from 'plugin-api/beta/client/services';
import styles from './TermsAndConditionsField.css';
import cn from 'classnames';

const TermsLink = () => (
  <a
    className={styles.link}
    href={t('talk-plugin-auth-checkbox.terms-link')}
    target="_blank"
  >
    {t('talk-plugin-auth-checkbox.terms')}
  </a>
);

const PrivacyLink = () => (
  <a
    className={styles.link}
    href={t('talk-plugin-auth-checkbox.privacy-policy-link')}
    target="_blank"
  >
    {t('talk-plugin-auth-checkbox.privacy-policy')}
  </a>
);

class TermsAndConditionsField extends React.Component {
  state = { checked: false };
  id = 'terms-and-conditions';

  componentWillMount() {
    this.props.indicateBlocker();
  }

  onChange = ({ target: { checked } }) => {
    this.setState({ checked });
    if (checked) {
      this.props.indicateBlockerResolved();
    } else {
      this.props.indicateBlocker();
    }
  };

  render() {
    return (
      <div
        className={cn(
          styles.fieldContainer,
          'talk-plugin-auth-checkbox-field-container'
        )}
      >
        <Checkbox
          checked={this.state.checked}
          className="talk-plugin-auth-checkbox-checkbox"
          onChange={this.onChange}
          id={this.id}
        />
        <div
          id={this.id}
          className={cn(
            styles.textLabel,
            'talk-plugin-auth-checkbox-text-label'
          )}
        >
          {t('talk-plugin-auth-checkbox.copy')}
          <TermsLink />
          {t('talk-plugin-auth-checkbox.and')}
          <PrivacyLink />
          {t('talk-plugin-auth-checkbox.from')}
        </div>
      </div>
    );
  }
}

export default TermsAndConditionsField;

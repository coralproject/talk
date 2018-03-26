import React from 'react';
import { Checkbox } from 'plugin-api/beta/client/components/ui';
import { t } from 'plugin-api/beta/client/services';

const TermsLink = () => (
  <a href={t('talk-plugin-health-report.termslink')}>
    {t('talk-plugin-health-report.terms')}
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
      <div>
        <Checkbox
          checked={this.state.checked}
          onChange={this.onChange}
          id={this.id}
        />
        <label id={this.id}>
          {t('talk-plugin-health-report.copy', <a>hola</a>, TermsLink)}
        </label>
      </div>
    );
  }
}

export default TermsAndConditionsField;

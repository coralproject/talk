import React, { Component } from 'react';
import t from 'coral-framework/services/i18n';
import RestrictedMessageBox from 'coral-framework/components/RestrictedMessageBox';

class ChangeUsername extends Component {
  render() {
    return (
      <RestrictedMessageBox>
        <div className="talk-change-username">
          <span>{t('framework.changed_name.msg')}</span>
        </div>
      </RestrictedMessageBox>
    );
  }
}

export default ChangeUsername;

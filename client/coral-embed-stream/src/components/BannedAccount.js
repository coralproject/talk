import React, { Component } from 'react';
import t from 'coral-framework/services/i18n';
import RestrictedMessageBox from 'coral-framework/components/RestrictedMessageBox';

class BannedAccount extends Component {
  render() {
    return (
      <RestrictedMessageBox>
        <span>
          <b>{t('framework.banned_account_header')}</b>
          <br /> {t('framework.banned_account_body')}
        </span>
      </RestrictedMessageBox>
    );
  }
}

export default BannedAccount;

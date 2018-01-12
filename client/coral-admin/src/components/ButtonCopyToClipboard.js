import React from 'react';
import { Button } from 'coral-ui';
import t from 'coral-framework/services/i18n';
import { withCopyToClipboard } from 'coral-framework/hocs';

class ButtonCopyToClipboard extends React.Component {
  render() {
    return <Button {...this.props}>{t('common.copy')}</Button>;
  }
}

export default withCopyToClipboard(ButtonCopyToClipboard);

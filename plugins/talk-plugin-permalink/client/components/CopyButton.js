import React from 'react';
import {t} from 'plugin-api/beta/client/services';
import {withCopyToClipboard} from 'plugin-api/beta/client/hocs';
import {Button} from 'plugin-api/beta/client/components/ui';

class ButtonCopyToClipboard extends React.Component {
  render () {
    return (
      <Button {...this.props} >
        {t('common.copy')}
      </Button>
    );
  }
}

export default withCopyToClipboard(ButtonCopyToClipboard);

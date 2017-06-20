import React from 'react';
import {Button} from 'coral-ui';
import t from 'coral-framework/services/i18n';
import {withCopyToClipboard} from 'coral-framework/hocs';

class ButtonCopyToClipboard extends React.Component {

  constructor() {
    super();

    this.state = {
      emailCopied: false
    };
  }

  showCopied() {
    this.setState({
      emailCopied: true
    }, () => {
      setTimeout(() => this.setState({
        emailCopied: false
      }), 3000);
    });
  }

  render () {
    return (
      <Button {...this.props}>
        {this.state.emailCopied ? t('common.copied') : t('common.copy')}
      </Button>
    );
  }
}

export default withCopyToClipboard(ButtonCopyToClipboard);

import React from 'react';
import ReactDOM from 'react-dom';
import Clipboard from 'clipboard';
import hoistStatics from 'recompose/hoistStatics';

export default hoistStatics(WrappedComponent => {
  class WithCopyToClipboard extends React.Component {
    componentDidMount() {
      const clipboard = new Clipboard(ReactDOM.findDOMNode(this));

      clipboard.on('success', e => {
        e.clearSelection();
      });
    }

    render() {
      const {
        copyTarget = '',
        copyText = '',
        className = '',
        ...rest
      } = this.props;

      return (
        <WrappedComponent
          className={className}
          data-clipboard-action="copy"
          data-clipboard-text={copyText}
          data-clipboard-target={copyTarget}
          {...rest}
        />
      );
    }
  }

  return WithCopyToClipboard;
});

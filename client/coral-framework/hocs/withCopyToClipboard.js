import React from 'react';
import ReactDOM from 'react-dom';
import Clipboard from 'clipboard';

export default (WrappedComponent) => {

  class withCopyToClipboard extends React.Component {
    componentDidMount() {
      const clipboard = new Clipboard(ReactDOM.findDOMNode(this));

      clipboard.on('success', (e) => {
        if (this.props.onCopy) {
          this.props.onCopy();
        }
        e.clearSelection();
      });
    }

    render() {
      const {target = '', text = '', className = '', ...rest} = this.props;

      return <WrappedComponent
        className={className}
        data-clipboard-action="copy"
        data-clipboard-text={text}
        data-clipboard-target={target}
        {...rest}
      />;
    }
  }

  return withCopyToClipboard;
};

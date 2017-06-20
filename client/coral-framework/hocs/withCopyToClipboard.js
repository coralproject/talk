import React from 'react';
import Clipboard from 'clipboard';

export default (config) => (WrappedComponent) => {
  console.log(config, WrappedComponent)

  class withCopyToClipboard extends React.Component {

    componentDidMount() {
      const node = ReactDOM.findDOMNode(WrappedComponent);
      const clipboard = new Clipboard(node);

      clipboard.on('success', (e) => {
        this.props.onCopy();
        e.clearSelection();
      });
    }

    render() {
      const {target = '', text = ''} = config;

      return <WrappedComponent
        className={className}
        data-clipboard-action="copy"
        data-clipboard-text={text}
        data-clipboard-target={target}
        {...this.props}
      />;
    }
  }

  return withCopyToClipboard;
};

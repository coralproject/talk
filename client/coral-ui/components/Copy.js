import React, {Component} from 'react';
import Clipboard from 'clipboard';

export default class Copy extends Component {

  constructor(props) {
    super(props);
    this.refCopyButton = this.refCopyButton.bind(this);
  }

  componentDidMount() {
    const clipboard = new Clipboard(this.copyButtonEl);

    clipboard.on('success', (e) => {
      this.props.onCopy();
      e.clearSelection();
    });
  }

  refCopyButton(button) {
    this.copyButtonEl = button;
  }

  render() {
    const {children, target = '', text = ''} = this.props;

    return (
     <span
       ref={this.refCopyButton}
       data-clipboard-action="copy"
       data-clipboard-text={text}
       data-clipboard-target={target}
     >
     {children}
     </span>
    );
  }
}

import React, { Component, PropTypes } from 'react';
import dialogPolyfill from 'dialog-polyfill';
import 'dialog-polyfill/dialog-polyfill.css';

export default class Dialog extends Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    onCancel: PropTypes.func,
    onClose: PropTypes.func,
    open: PropTypes.bool,
    style: PropTypes.object
  };

  static defaultProps = {
    onCancel: e => e.preventDefault(),
    onClose: e => e.preventDefault()
  };

  componentDidMount(){
    const dialog = this.dialog;
    dialogPolyfill.registerDialog(dialog);

    if (this.props.open) {
      dialog.showModal();
    }

    dialog.addEventListener('close', this.props.onClose);
    dialog.addEventListener('cancel', this.props.onCancel);
  }

  componentDidUpdate(prevProps) {
    const dialog = this.dialog;
    if (this.props.open !== prevProps.open) {
      if (this.props.open) {
        dialog.showModal();
      } else {
        dialog.close();
      }
    }
  }

  componentWillUnmount() {
    const dialog = this.dialog;
    if (dialog) {
      dialog.removeEventListener('cancel', this.props.onCancel);      
    }
  }

  render() {
    const {children, className = '', onClose, onCancel, open, ...rest} = this.props; // eslint-disable-line

    return (
      <dialog
        ref={el => { this.dialog = el; }}
        className={`mdl-dialog ${className}`}
        {...rest}
      >
          {children}
      </dialog>
    );
  }
}

import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './ConfirmChangesDialog.css';
import { Dialog } from 'plugin-api/beta/client/components/ui';

const initialState = { step: 0 };

class ConfirmChangesDialog extends React.Component {
  state = initialState;

  goToNextStep = () => {
    this.setState(({ step }) => ({
      step: step + 1,
    }));
  };

  clear = () => {
    this.setState(initialState);
  };

  cancel = () => {
    this.clear();
    this.props.closeDialog();
  };

  continue = () => {
    this.goToNextStep();
  };

  finish = () => {
    this.clear();
    this.props.closeDialog();
    this.props.finish();
  };

  renderSteps = () => {
    const steps = React.Children.toArray(this.props.children)
      .filter(child => child.props.enable)
      .filter((_, i) => i === this.state.step);

    return steps.map(child => {
      return React.cloneElement(child, {
        goToNextStep: this.goToNextStep,
        clear: this.clear,
        cancel: this.cancel,
        next:
          this.state.step === steps.length - 1 ? this.finish : this.continue,
      });
    });
  };

  render() {
    return (
      <Dialog
        open={this.props.showDialog}
        className={cn(
          styles.dialog,
          'talk-plugin-local-auth--edit-profile-dialog'
        )}
      >
        {this.renderSteps()}
      </Dialog>
    );
  }
}

ConfirmChangesDialog.propTypes = {
  children: PropTypes.node,
  closeDialog: PropTypes.func,
  showDialog: PropTypes.bool,
  finish: PropTypes.func,
};

export default ConfirmChangesDialog;

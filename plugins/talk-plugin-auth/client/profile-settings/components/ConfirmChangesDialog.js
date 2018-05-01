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

  render() {
    const totalSteps = React.Children.count(this.props.children);

    if (!totalSteps) return null;

    return (
      <Dialog
        open={this.props.showDialog}
        className={cn(styles.dialog, 'talk-plugin-auth--edit-profile-dialog')}
      >
        {React.Children.map(this.props.children, (child, i) => {
          const totalSteps = React.Children.count(this.props.children);
          if (i !== this.state.step) return;
          return React.cloneElement(child, {
            goToNextStep: this.goToNextStep,
            clear: this.clear,
            cancel: this.cancel,
            next:
              this.state.step === totalSteps - 1 ? this.finish : this.continue,
          });
        })}
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

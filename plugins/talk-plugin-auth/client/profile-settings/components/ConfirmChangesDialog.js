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

  saveAndContinue = async () => {
    await this.props.saveChanges();
    this.goToNextStep();
  };

  saveAndFinish = async () => {
    await this.props.saveChanges();
    this.clear();
    this.closeDialog();
  };

  clear = () => {
    this.setState(initialState);
  };

  cancel = async () => {
    this.clear();
    this.closeDialog();
  };

  render() {
    return (
      <Dialog
        open={this.props.showDialog}
        className={cn(styles.dialog, 'talk-plugin-auth--edit-profile-dialog')}
      >
        {React.Children.map(this.props.children, (child, i) => {
          const totalSteps = React.Children.count(this.props.children);
          if (i !== this.state.step) return;
          return React.cloneElement(child, {
            ...this.props,
            cancel: this.cancel,
            saveChanges:
              i === totalSteps - 1 ? this.saveAndFinish : this.saveAndContinue,
          });
        })}
      </Dialog>
    );
  }
}

ConfirmChangesDialog.propTypes = {
  children: PropTypes.node,
  saveChanges: PropTypes.func,
  closeDialog: PropTypes.func,
  showDialog: PropTypes.bool,
  onChange: PropTypes.func,
  emailAddress: PropTypes.string,
  username: PropTypes.string,
  formData: PropTypes.object,
};

export default ConfirmChangesDialog;

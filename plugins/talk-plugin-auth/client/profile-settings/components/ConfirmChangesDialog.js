import React from 'react';
import cn from 'classnames';
import styles from './ConfirmChangesDialog.css';
import { Dialog } from 'plugin-api/beta/client/components/ui';
import ChangeUsernameContentDialog from './ChangeUsernameContentDialog';
import ChangeEmailContentDialog from './ChangeEmailContentDialog';

class ConfirmChangesDialog extends React.Component {
  render() {
    return (
      <Dialog
        open={this.props.showDialog}
        className={cn(styles.dialog, 'talk-plugin-auth--edit-profile-dialog')}
      >
        <ChangeUsernameContentDialog {...this.props} />
        <ChangeEmailContentDialog {...this.props} />
      </Dialog>
    );
  }
}

export default ConfirmChangesDialog;

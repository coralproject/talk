import React from 'react';
import {Dialog} from 'coral-ui';
import styles from './styles.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations';
const lang = new I18n(translations);

const CreateDisplayNameDialog = ({open, handleClose, offset, loggedIn}) => (
  <Dialog
    className={styles.dialog}
    id="createDisplayNameDialog"
    open={open}
    style={{
      position: 'relative',
      top: offset !== 0 && offset
    }}>
    <span className={styles.close} onClick={handleClose}>×</span>
    <div>
      <div className={styles.header}>
        <h1>
          {lang.t('createdisplay.writeyourusername')}
        </h1>
        Logged {loggedIn}
      </div>
    </div>
  </Dialog>
);

// <form onSubmit={props.handleSignIn}>
//   <FormField
//     id="displayName"
//     type="string"
//     label={lang.t('createdisplay.displayName')}
//     value="yeah"
//     onChange={props.handleSubmitForm}
//   />
//   <div className={styles.action}>
//     <Button id='save' type="submit" cStyle="black" className={styles.saveButton} full>
//       {lang.t('createdisplay.save')}
//     </Button>
//   </div>
// </form>

export default CreateDisplayNameDialog;

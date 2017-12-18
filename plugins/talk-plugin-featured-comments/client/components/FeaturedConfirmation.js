import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import {Dialog} from 'coral-ui';
import styles from './FeaturedConfirmation.css';

import Button from 'coral-ui/components/Button';
import t from 'coral-framework/services/i18n';

const FeaturedConfirmation = ({open, onCancel, onPerform}) => (
  <Dialog
    className={cn(styles.dialog, 'talk-featured-dialog')}
    id="banUserDialog"
    open={open}
    onCancel={onCancel} >
    <span className={styles.close} onClick={onCancel}>×</span>
    <div className={styles.header}>
      <h2>
        {t('talk-plugin-featured-comments.feature_comment')}
      </h2>
    </div>
    <div className={styles.separator}>
      <h3>{t('talk-plugin-featured-comments.are_you_sure')}</h3>
    </div>
    <div className={styles.buttons}>
      <Button
        className={cn(styles.cancel, 'talk-featured-dialog-button-cancel')}
        cStyle="cancel"
        onClick={onCancel}
        raised >
        {t('talk-plugin-featured-comments.cancel')}
      </Button>
      <Button 
        className={cn(styles.perform, 'talk-featured-dialog-button-confirm')}
        cStyle="black"
        onClick={onPerform}
        raised >
        {t('talk-plugin-featured-comments.yes_feature_comment')}
      </Button>
    </div>
  </Dialog>
);

FeaturedConfirmation.propTypes = {
  open: PropTypes.bool,
  onPerform: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default FeaturedConfirmation;

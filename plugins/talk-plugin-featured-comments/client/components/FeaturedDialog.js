import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import {Dialog} from 'coral-ui';
import styles from './FeaturedDialog.css';
import {t} from 'plugin-api/beta/client/services';
import Button from 'coral-ui/components/Button';

const FeaturedDialog = ({showFeaturedDialog, closeFeaturedDialog, postTag}) => (
  <Dialog
    className={cn(styles.dialog, 'talk-featured-dialog')}
    id="talkFeaturedDialog"
    open={showFeaturedDialog}
    onCancel={closeFeaturedDialog} >
    <span className={styles.close} onClick={closeFeaturedDialog}>×</span>
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
        onClick={closeFeaturedDialog}
        raised >
        {t('talk-plugin-featured-comments.cancel')}
      </Button>
      <Button 
        className={cn(styles.perform, 'talk-featured-dialog-button-confirm')}
        cStyle="black"
        onClick={postTag}
        raised >
        {t('talk-plugin-featured-comments.yes_feature_comment')}
      </Button>
    </div>
  </Dialog>
);

FeaturedDialog.propTypes = {
  showFeaturedDialog: PropTypes.bool.isRequired,
  closeFeaturedDialog: PropTypes.func.isRequired,
};

export default FeaturedDialog;

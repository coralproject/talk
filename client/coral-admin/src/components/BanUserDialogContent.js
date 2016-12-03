import React from 'react';
import Button from 'coral-ui/components/Button';
import styles from './BanUserDialog.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations';
const lang = new I18n(translations);

export const BanUserDialogContent = () => (
  <div>
    <div className={styles.header}>
      <h1>
        {lang.t('bandialog.ban_user')}
      </h1>
    </div>
    <div className={styles.separator}>
      <h2>
        {lang.t('bandialog.are_you_sure')}
      </h2>
      <h3>
        {lang.t('bandialog.note')}
      </h3>
    </div>
    <div className={styles.buttons}>
      <Button cStyle="cancel" full>
        {lang.t('bandialog.cancel')}
      </Button>
      <Button cStyle="black" full>
        {lang.t('bandialog.yes_ban_user')}
      </Button>
    </div>
  </div>
);

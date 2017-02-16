import React from 'react';
import styles from './styles.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-admin/src/translations.json';
import {Link} from 'react-router';

const lang = new I18n(translations);

const ModerationMenu = ({asset}) => {
  const premodPath = asset ? `/admin/moderate/premod/${asset.id}` : '/admin/moderate/premod';
  const rejectPath = asset ? `/admin/moderate/rejected/${asset.id}` : '/admin/moderate/rejected';
  const flagPath = asset ? `/admin/modetate/flagged/${asset.id}` : '/admin/moderate/flagged';
  return (
    <div className='mdl-tabs'>
      <div className={`mdl-tabs__tab-bar ${styles.tabBar}`}>
        <div>
          <Link to={premodPath} className={`mdl-tabs__tab ${styles.tab}`} activeClassName={styles.active}>
            {lang.t('modqueue.premod')}
          </Link>
          <Link to={rejectPath} className={`mdl-tabs__tab ${styles.tab}`} activeClassName={styles.active}>
            {lang.t('modqueue.rejected')}
          </Link>
          <Link to={flagPath} className={`mdl-tabs__tab ${styles.tab}`} activeClassName={styles.active}>
          {lang.t('modqueue.flagged')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ModerationMenu;

import React from 'react';
import styles from './styles.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-admin/src/translations.json';
import {Link} from 'react-router';

const lang = new I18n(translations);

const ModerationMenu = (props) => (
  <div className='mdl-tabs'>
    <div className={`mdl-tabs__tab-bar ${styles.tabBar}`}>
      {
        props.asset ? (
          <div>
            <Link to={`/admin/moderate/premod/${props.asset.id}`} className={`mdl-tabs__tab ${styles.tab}`} activeClassName={styles.active}>
              {lang.t('modqueue.premod')}
            </Link>
            <Link to={`/admin/moderate/rejected/${props.asset.id}`} className={`mdl-tabs__tab ${styles.tab}`} activeClassName={styles.active}>
              {lang.t('modqueue.rejected')}
            </Link>
            <Link to={`/admin/moderate/flagged/${props.asset.id}`} className={`mdl-tabs__tab ${styles.tab}`} activeClassName={styles.active}>
            {lang.t('modqueue.flagged')}
            </Link>
          </div>
          ) : (
            <div>
              <Link to='/admin/moderate/premod' className={`mdl-tabs__tab ${styles.tab}`} activeClassName={styles.active}>
                {lang.t('modqueue.premod')}
              </Link>
              <Link to='/admin/moderate/rejected' className={`mdl-tabs__tab ${styles.tab}`} activeClassName={styles.active}>
                {lang.t('modqueue.rejected')}
              </Link>
              <Link to='/admin/moderate/flagged' className={`mdl-tabs__tab ${styles.tab}`} activeClassName={styles.active}>
                {lang.t('modqueue.flagged')}
              </Link>
            </div>
          )
      }
    </div>
  </div>
);

export default ModerationMenu;

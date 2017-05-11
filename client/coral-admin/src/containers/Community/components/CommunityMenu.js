import React from 'react';

import styles from './styles.css';

import I18n from 'coral-i18n/modules/i18n/i18n';

import {Link} from 'react-router';

const lang = new I18n();

const CommunityMenu = () => {
  const flaggedPath = '/admin/community/flagged';
  const peoplePath = '/admin/community/people';
  return (
    <div className='mdl-tabs'>
      <div className={`mdl-tabs__tab-bar ${styles.tabBar}`}>
        <div>
          <Link to={flaggedPath} className={`mdl-tabs__tab ${styles.tab}`} activeClassName={styles.active}>
            {lang.t('community.flaggedaccounts')}
          </Link>
          <Link to={peoplePath} className={`mdl-tabs__tab ${styles.tab}`} activeClassName={styles.active}>
            {lang.t('community.people')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CommunityMenu;

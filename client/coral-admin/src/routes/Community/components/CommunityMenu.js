import React from 'react';
import styles from './CommunityMenu.css';
import t from 'coral-framework/services/i18n';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import CountBadge from '../../../components/CountBadge';

const CommunityMenu = ({ flaggedUsernamesCount = 0 }) => {
  const flaggedPath = '/admin/community/flagged';
  const peoplePath = '/admin/community/people';

  return (
    <div className="mdl-tabs">
      <div className={`mdl-tabs__tab-bar ${styles.tabBar}`}>
        <div>
          <Link
            to={flaggedPath}
            className={`mdl-tabs__tab ${
              styles.tab
            } talk-admin-nav-flagged-accounts`}
            activeClassName={styles.active}
          >
            {t('community.flaggedaccounts')}
            <CountBadge count={flaggedUsernamesCount} />
          </Link>
          <Link
            to={peoplePath}
            className={`mdl-tabs__tab ${styles.tab} talk-admin-nav-people`}
            activeClassName={styles.active}
          >
            {t('community.people')}
          </Link>
        </div>
      </div>
    </div>
  );
};

CommunityMenu.propTypes = {
  flaggedUsernamesCount: PropTypes.number,
};

export default CommunityMenu;

import React, {PropTypes} from 'react';
import styles from './styles.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-admin/src/translations.json';
import {Link} from 'react-router';
import {Badge} from 'react-mdl';

const lang = new I18n(translations);

const ModerationMenu = ({asset, premodCount, rejectCount, flagCount}) => {
  const premodPath = asset ? `/admin/moderate/premod/${asset.id}` : '/admin/moderate/premod';
  const rejectPath = asset ? `/admin/moderate/rejected/${asset.id}` : '/admin/moderate/rejected';
  const flagPath = asset ? `/admin/modetate/flagged/${asset.id}` : '/admin/moderate/flagged';
  return (
    <div className='mdl-tabs'>
      <div className={`mdl-tabs__tab-bar ${styles.tabBar}`}>
        <div>
          <Link to={premodPath} className={`mdl-tabs__tab ${styles.tab}`} activeClassName={styles.active}>
            <Badge text={premodCount}>{lang.t('modqueue.premod')}</Badge>
          </Link>
          <Link to={rejectPath} className={`mdl-tabs__tab ${styles.tab}`} activeClassName={styles.active}>
            <Badge text={rejectCount}>{lang.t('modqueue.rejected')}</Badge>
          </Link>
          <Link to={flagPath} className={`mdl-tabs__tab ${styles.tab}`} activeClassName={styles.active}>
          <Badge text={flagCount}>{lang.t('modqueue.flagged')}</Badge>
          </Link>
        </div>
      </div>
    </div>
  );
};

ModerationMenu.propTypes = {
  premodCount: PropTypes.number.isRequired,
  rejectCount: PropTypes.number.isRequired,
  flagCount: PropTypes.number.isRequired,
  asset: PropTypes.shape({
    id: PropTypes.string.isRequired
  })
};

export default ModerationMenu;

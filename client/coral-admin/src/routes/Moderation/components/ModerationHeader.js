import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {Icon} from 'coral-ui';
import styles from './styles.css';
import t from 'coral-framework/services/i18n';

const ModerationHeader = ({asset, searchVisible, openSearch, closeSearch}) => {

  const trigger = searchVisible ? closeSearch : openSearch;
  const searchTriggerIcon = <Icon className={styles.searchTrigger} name={searchVisible ? 'arrow_drop_up' : 'arrow_drop_down'} />;

  const allStreams = asset
    ? <Link className="mdl-tabs__tab" to="/admin/moderate">{t('modqueue.all_streams')}</Link>
    : <a className="mdl-tabs__tab" />;

  const title = asset
    ? <span onClick={trigger} className="mdl-tabs__tab">{asset.title} {searchTriggerIcon}</span>
    : <span onClick={trigger} className="mdl-tabs__tab">{t('modqueue.all_streams')} {searchTriggerIcon}</span>;

  return (
    <div className=''>
      <div className={`mdl-tabs ${styles.header}`}>
        <div className={`mdl-tabs__tab-bar ${styles.moderateAsset}`}>
          {allStreams}
          {title}
          <Link className="mdl-tabs__tab" to="/admin/stories">{t('modqueue.select_stream')}</Link>
        </div>
      </div>
    </div>
  );
};

ModerationHeader.propTypes = {
  asset: PropTypes.shape({
    title: PropTypes.string,
    id: PropTypes.string
  }),
  openSearch: PropTypes.func.isRequired,
  closeSearch: PropTypes.func.isRequired
};

export default ModerationHeader;

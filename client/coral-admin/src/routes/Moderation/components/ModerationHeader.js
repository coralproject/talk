import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'coral-ui';
import styles from './ModerationHeader.css';
import t from 'coral-framework/services/i18n';

const ModerationHeader = ({
  asset,
  searchVisible,
  openSearch,
  closeSearch,
}) => {
  const trigger = searchVisible ? closeSearch : openSearch;
  const searchTriggerIcon = (
    <Icon
      className={styles.searchTrigger}
      name={searchVisible ? 'arrow_drop_up' : 'arrow_drop_down'}
    />
  );

  const title = asset ? (
    <a onClick={trigger} className="mdl-tabs__tab">
      {asset.title} {searchTriggerIcon}
    </a>
  ) : (
    <a onClick={trigger} className="mdl-tabs__tab">
      {t('modqueue.all_streams')} {searchTriggerIcon}
    </a>
  );

  return (
    <div className="">
      <div className={`mdl-tabs ${styles.header}`}>
        <div className={`mdl-tabs__tab-bar ${styles.moderateAsset}`}>
          {title}
        </div>
      </div>
    </div>
  );
};

ModerationHeader.propTypes = {
  asset: PropTypes.shape({
    title: PropTypes.string,
    id: PropTypes.string,
  }),
  openSearch: PropTypes.func.isRequired,
  closeSearch: PropTypes.func.isRequired,
  searchVisible: PropTypes.bool,
};

export default ModerationHeader;

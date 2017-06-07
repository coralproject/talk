import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {Icon} from 'coral-ui';
import styles from './styles.css';
import t from 'coral-framework/services/i18n';

const ModerationHeader = (props) => {

  const allStreams = props.asset
    ? <Link className="mdl-tabs__tab" to="/admin/moderate">{t('modqueue.all_streams')}</Link>
    : <a className="mdl-tabs__tab" />;

  const title = props.asset
    ? (
      <Link className="mdl-tabs__tab" to={`/admin/moderate/${props.asset.id}`}>
        {props.asset.title} <Icon className={styles.searchTrigger} name="keyboard_arrow_down" />
      </Link>
    )
    : <a className="mdl-tabs__tab">{t('modqueue.all_streams')} <Icon className={styles.searchTrigger} name="keyboard_arrow_down" /></a>;

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
  openSearch: PropTypes.func.isRequired
};

export default ModerationHeader;

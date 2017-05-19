import React from 'react';
import {Link} from 'react-router';
import {Icon} from 'coral-ui';
import styles from './styles.css';
import t from 'coral-framework/services/i18n';

const ModerationHeader = (props) => (
    <div className=''>
      <div className={`mdl-tabs ${styles.header}`}>
        {
          props.asset ?
            <div className={`mdl-tabs__tab-bar ${styles.moderateAsset}`}>
              <Link className="mdl-tabs__tab" to="/admin/moderate">{t('modqueue.all_streams')}</Link>
              <a className="mdl-tabs__tab" href={props.asset.url}>
                <span>{props.asset.title}</span>
                <Icon className={styles.settingsButton} name="open_in_new"/>
              </a>
              <Link className="mdl-tabs__tab" to="/admin/stories">Select Stream</Link>
            </div>
            :
            <div className={`mdl-tabs__tab-bar ${styles.moderateAsset}`}>
              <a className="mdl-tabs__tab" />
              <a className="mdl-tabs__tab">{t('modqueue.all_streams')}</a>
              <Link className="mdl-tabs__tab" to="/admin/stories">{t('modqueue.select_stream')}</Link>
            </div>
        }
      </div>
    </div>
);
export default ModerationHeader;

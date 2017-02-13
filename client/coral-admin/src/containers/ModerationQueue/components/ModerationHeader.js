import React from 'react';
import {Link} from 'react-router';
import styles from './styles.css';

const ModerationHeader = props => (
    <div className=''>
      <div className={`mdl-tabs ${styles.header}`}>
        {
          props.asset ?
            <div className={`mdl-tabs__tab-bar ${styles.moderateAsset}`}>
              <Link className="mdl-tabs__tab" to="/admin/moderate">All Streams</Link>
              <a className="mdl-tabs__tab">{props.asset.title}</a>
              <Link className="mdl-tabs__tab" to="/admin/streams">Select Stream</Link>
            </div>
            :
            <div className={`mdl-tabs__tab-bar ${styles.moderateAsset}`}>
              <a className="mdl-tabs__tab" />
              <a className="mdl-tabs__tab">All Streams</a>
              <Link className="mdl-tabs__tab" to="/admin/streams">Select Stream</Link>
            </div>
        }
      </div>
    </div>
);
export default ModerationHeader;

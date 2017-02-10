import React, {PropTypes} from 'react';
import styles from '../ModerationQueue.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../../translations.json';

const lang = new I18n(translations);

const ModerationMenu = (props) => (
  <div className='mdl-tabs'>
    <div className={`mdl-tabs__tab-bar ${styles.tabBar}`}>
      <a href='#all'
         onClick={(e) => {
           e.preventDefault();
           props.onTabClick('all');
         }}
         className={`mdl-tabs__tab ${styles.tab} ${props.activeTab === 'all' ? styles.active : ''}`}
      >
        {lang.t('modqueue.all')}
      </a>
      {
        props.enablePremodTab
          ? <a href='#premod'
               onClick={(e) => {
                 e.preventDefault();
                 props.onTabClick('premod');
               }}
               className={`mdl-tabs__tab ${styles.tab} ${props.activeTab === 'premod' ? styles.active : ''}`}>
            {lang.t('modqueue.premod')}
          </a>
          : null
      }
      <a href='#rejected'
         onClick={(e) => {
           e.preventDefault();
           props.onTabClick('rejected');
         }}
         className={`mdl-tabs__tab ${styles.tab} ${props.activeTab === 'rejected' ? styles.active : ''}`}
      >
        {lang.t('modqueue.rejected')}
      </a>
      <a href='#flagged'
         onClick={(e) => {
           e.preventDefault();
           props.onTabClick('flagged');
         }}
         className={`mdl-tabs__tab ${styles.tab} ${props.activeTab === 'flagged' ? styles.active : ''}`}
      >
        {lang.t('modqueue.flagged')}
      </a>
    </div>
  </div>
);

ModerationMenu.propTypes = {
  activeTab: PropTypes.string.isRequired,
  enablePremodTab: PropTypes.bool
};

export default ModerationMenu;

import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import styles from './Widget.css';
import I18n from 'coral-i18n/modules/i18n/i18n';
import translations from 'coral-admin/src/translations';

const lang = new I18n(translations);

const ActivityWidget = ({assets}) => {
  return (
    <div className={styles.widget}>
      <h2 className={styles.heading}>Articles with the most conversations</h2>
      <div className={styles.widgetHead}>
        <p>{lang.t('streams.article')}</p>
        <p>{lang.t('dashboard.comment_count')}</p>
      </div>
      <div className={styles.widgetTable}>
        {
          assets.length
          ? assets.map(asset => {
            return (
              <div className={styles.rowLinkify} key={asset.id}>
                <Link className={styles.linkToModerate} to={`/admin/moderate/flagged/${asset.id}`}>Moderate</Link>
                <p className={styles.widgetCount}>{asset.commentCount}</p>
                <Link className={styles.linkToAsset} to={`${asset.url}#coralStreamEmbed_iframe`} target="_blank">
                  <p className={styles.assetTitle}>{asset.title}</p>
                </Link>
                <p className={styles.lede}>{asset.author} — Published: {new Date(asset.created_at).toLocaleDateString()}</p>
              </div>
            );
          })
          : <div className={styles.rowLinkify}>{lang.t('dashboard.no_activity')}</div>
        }
      </div>
    </div>
  );
};

ActivityWidget.propTypes = {
  assets: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    url: PropTypes.string,
    commentCount: PropTypes.number,
    author: PropTypes.string,
    created_at: PropTypes.string
  })).isRequired
};

export default ActivityWidget;

import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import styles from './Widget.css';
import t from 'coral-framework/services/i18n';

const ActivityWidget = ({assets}) => {
  return (
    <div className={styles.widget}>
      <h2 className={styles.heading}>{t('dashboard.most_conversations')}</h2>
      <div className={styles.widgetHead}>
        <p>{t('streams.article')}</p>
        <p>{t('dashboard.comment_count')}</p>
      </div>
      <div className={styles.widgetTable}>
        {
          assets.length
            ? assets.map((asset) => {
              return (
                <div className={styles.rowLinkify} key={asset.id}>
                  <Link className={styles.linkToModerate} to={`/admin/moderate/${asset.id}`}>Moderate</Link>
                  <p className={styles.widgetCount}>{asset.commentCount}</p>
                  <a className={styles.linkToAsset} href={`${asset.url}`} target="_blank">
                    <p className={styles.assetTitle}>{asset.title}</p>
                  </a>
                  <p className={styles.lede}>{asset.author} — Published: {new Date(asset.created_at).toLocaleDateString()}</p>
                </div>
              );
            })
            : <div className={styles.rowLinkify}>{t('dashboard.no_activity')}</div>
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

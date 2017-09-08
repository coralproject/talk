import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import styles from './Widget.css';

import t from 'coral-framework/services/i18n';

const FlagWidget = ({assets}) => {

  return (
    <div className={styles.widget}>
      <h2 className={styles.heading}>{t('dashboard.most_flags')}</h2>
      <div className={styles.widgetHead}>
        <p>{t('streams.article')}</p>
        <p>{t('dashboard.flags')}</p>
      </div>
      <div className={styles.widgetTable}>
        {
          assets.length
            ? assets.map((asset) => {
              let flagSummary = null;
              if (asset.action_summaries) {
                flagSummary = asset.action_summaries.find((s) => s.__typename === 'FlagAssetActionSummary');
              }

              return (
                <div className={styles.rowLinkify} key={asset.id}>
                  <Link className={styles.linkToModerate} to={`/admin/moderate/reported/${asset.id}`}>Moderate</Link>
                  <p className={styles.widgetCount}>{flagSummary ? flagSummary.actionCount : 0}</p>
                  <a className={styles.linkToAsset} href={`${asset.url}`} target="_blank">
                    <p className={styles.assetTitle}>{asset.title}</p>
                  </a>
                  <p className={styles.lede}>{asset.author} — Published: {new Date(asset.created_at).toLocaleDateString()}</p>
                </div>
              );
            })
            : <div className={styles.rowLinkify}>{t('dashboard.no_flags')}</div>
        }
      </div>
    </div>
  );
};

FlagWidget.propTypes = {
  assets: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    url: PropTypes.string,
    action_summaries: PropTypes.array,
    author: PropTypes.string,
    created_at: PropTypes.string
  })).isRequired
};

export default FlagWidget;

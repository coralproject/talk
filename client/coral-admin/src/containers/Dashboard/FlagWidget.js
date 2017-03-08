import React from 'react';
import {Link} from 'react-router';
import styles from './Widget.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-admin/src/translations';
import range from 'lodash/range';

const lang = new I18n(translations);

const FlagWidget = (props) => {
  const {assets} = props;

  return (
    <div className={styles.widget}>
      <h2 className={styles.heading}>Articles with the most flags</h2>
      <div className={styles.widgetTable}>
        <div className={styles.widgetHead}>
          <p>{lang.t('streams.article')}</p>
          <p>{lang.t('dashboard.flags')}</p>
        </div>
        <div>
          {
            assets.length
            ? assets.map(asset => {
              const flagSummary = asset.action_summaries.find(s => s.type === 'FlagAssetActionSummary');
              return (
                <div className={styles.rowLinkify} key={asset.id}>
                  <p className={styles.widgetCount}>{flagSummary ? flagSummary.actionCount : 0}</p>
                  <Link className={styles.linkToAsset} to={`/admin/moderate/flagged/${asset.id}`}>
                    <p className={styles.assetTitle}>{asset.title}</p>
                    <p className={styles.lede}>{asset.author} — Published: {new Date(asset.created_at).toLocaleDateString()}</p>
                  </Link>
                </div>
              );
            })
            : <div className={styles.rowLinkify}>{lang.t('dashboard.no_flags')}</div>
          }
        </div>
      </div>
    </div>
  );
};

export default FlagWidget;

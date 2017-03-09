import React from 'react';
import {Link} from 'react-router';
import styles from './Widget.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-admin/src/translations';

const lang = new I18n(translations);

const LikeWidget = (props) => {

  const {assets} = props;

  return (
    <div className={styles.widget}>
      <h2 className={styles.heading}>Articles with the most likes</h2>
      <div className={styles.widgetHead}>
        <p>{lang.t('streams.article')}</p>
        <p>{lang.t('modqueue.likes')}</p>
      </div>
      <div className={styles.widgetTable}>
        {
          assets.length
          ? assets.map(asset => {
            const likeSummary = asset.action_summaries.find(s => s.type === 'LikeAssetActionSummary');
            return (
              <div className={styles.rowLinkify} key={asset.id}>
                <Link className={styles.linkToModerate} to={`/admin/moderate/flagged/${asset.id}`}>Moderate</Link>
                <p className={styles.widgetCount}>{likeSummary ? likeSummary.actionCount : 0}</p>
                <Link className={styles.linkToAsset} to={`${asset.url}#coralStreamEmbed_iframe`} target="_blank">
                  <p className={styles.assetTitle}>{asset.title}</p>
                </Link>
                <p className={styles.lede}>{asset.author} — Published: {new Date(asset.created_at).toLocaleDateString()}</p>
              </div>
            );
          })
          : <div className={styles.rowLinkify}>{lang.t('dashboard.no_likes')}</div>
        }
      </div>
    </div>
  );
};

export default LikeWidget;

import React from 'react';
import {Link} from 'react-router';
import styles from './Widget.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-admin/src/translations';
import range from 'lodash/range';

const lang = new I18n(translations);

const LikeWidget = (props) => {

  const {assets} = props;

  return (
    <div className={styles.widget}>
      <h2 className={styles.heading}>Articles with the most likes</h2>
      <table className={styles.widgetTable}>
        <thead className={styles.widgetHead}>
          <tr>
            <th>{lang.t('streams.article')}</th>
            <th>{lang.t('modqueue.likes')}</th>
          </tr>
        </thead>
        <tbody>
          {
            assets.length
            ? assets.map(asset => {
              const likeSummary = asset.action_summaries.find(s => s.type === 'LikeAssetActionSummary');
              return (
                <tr className={styles.rowLinkify} key={asset.id}>
                  <td>
                    <Link className={styles.linkToAsset} to={`/admin/moderate/flagged/${asset.id}`}>
                      <p className={styles.assetTitle}>{asset.title}</p>
                      <p className={styles.lede}>{asset.author} — Published: {new Date(asset.created_at).toLocaleDateString()}</p>
                    </Link>
                  </td>
                  <td>
                    <Link className={styles.linkToAsset} to={`/admin/moderate/flagged/${asset.id}`}>
                      <p className={styles.widgetCount}>{likeSummary ? likeSummary.actionCount : 0}</p>
                    </Link>
                  </td>
                </tr>
              );
            })
            : <tr className={styles.rowLinkify}><td colSpan="2">{lang.t('dashboard.no_likes')}</td></tr>
          }
          { /* rows in a table with a fixed height will expand and ignore height.
                put in some extra rows. */
            range(10 - Math.max(assets.length, 1)).map(() => <tr className={styles.emptyRow}></tr>)
          }
        </tbody>
      </table>
    </div>
  );
};

export default LikeWidget;

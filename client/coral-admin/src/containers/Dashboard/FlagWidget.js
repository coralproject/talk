import React from 'react';
import {compose} from 'react-apollo';
import {mostFlags} from 'coral-admin/src/graphql/queries';
import {Link} from 'react-router';
import styles from './Widget.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-admin/src/translations';
import {Spinner} from 'coral-ui';

const lang = new I18n(translations);

const FlagWidget = (props) => {

  if (props.data.loading) {
    return <Spinner />;
  }

  const {data: {metrics: assets}} = props;

  return (
    <div className={styles.widget}>
      <h2 className={styles.heading}>Top Ten Articles with the most flagged comments</h2>
      <table className={styles.widgetTable}>
        <thead className={styles.widgetHead}>
          <tr>
            <th></th>{/* empty on purpose */}
            <th>{lang.t('streams.article')}</th>
            <th>{lang.t('modqueue.flagged')}</th>
            <th>{lang.t('modqueue.likes')}</th>
            <th>{lang.t('dashboard.comment_count')}</th>
          </tr>
        </thead>
        <tbody>
          {
            assets.length
            ? assets.map((asset, index) => {
              const flagSummary = asset.action_summaries.find(s => s.type === 'FlagAssetActionSummary');
              const likeSummary = asset.action_summaries.find(s => s.type === 'LikeAssetActionSummary');
              return (
                <tr key={asset.id}>
                  <td>{index + 1}.</td>
                  <td>
                    <Link to={`/admin/moderate/flagged/${asset.id}`}>{asset.title}</Link>
                    <p className={styles.lede}>{asset.author} - Published: {new Date(asset.created_at).toLocaleDateString()}</p>
                  </td>
                  <td>{flagSummary ? flagSummary.actionCount : 0}</td>
                  <td>{likeSummary ? likeSummary.actionCount : 0}</td>
                  <td>{asset.commentCount}</td>
                </tr>
              );
            })
            : <tr><td colSpan="3">{lang.t('dashboard.no_flags')}</td></tr>
          }
        </tbody>
      </table>
    </div>
  );
};

export default compose(mostFlags)(FlagWidget);

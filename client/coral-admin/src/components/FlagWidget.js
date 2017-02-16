import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import styles from './FlagWidget.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-admin/src/translations';

const lang = new I18n(translations);

const FlagWidget = ({assets}) => {

  return (
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
            const flagCount = asset.action_summaries.find(s => s.__typename === 'FlagAssetActionSummary').actionCount;
            const likeCount = asset.action_summaries.find(s => s.__typename === 'LikeAssetActionSummary').actionCount;
            return (
              <tr key={asset.id}>
                <td>{index + 1}.</td>
                <td>
                  <Link to={`/admin/moderate/flagged/${asset.id}`}>{asset.title}</Link>
                  <p className={styles.lede}>{asset.author} - Published: {new Date(asset.created_at).toLocaleDateString()}</p>
                </td>
                <td>{likeCount}</td>
                <td>{flagCount}</td>
                <td>{asset.commentCount}</td>
              </tr>
            );
          })
          : <tr><td colSpan="3">{lang.t('dashboard.no_flags')}</td></tr>
        }
      </tbody>
    </table>
  );
};

FlagWidget.propTypes = {
  assets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      url: PropTypes.string,
      commentCount: PropTypes.number,
      action_summaries: PropTypes.arrayOf(
        PropTypes.shape({
          __typename: PropTypes.string.isRequired,
          actionCount: PropTypes.number.isRequired,
          actionableItemCount: PropTypes.number.isRequired
        })
      )
    })
  ).isRequired
};

export default FlagWidget;

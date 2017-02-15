import React, {PropTypes} from 'react';
import styles from './FlagWidget.css';

const FlagWidget = ({assets}) => {

  return (
    <table className={styles.widgetTable}>
      <thead className={styles.widgetHead}>
        <tr>
          <th>Article</th>
          <th>Flags</th>
          <th>Comment Count</th>
        </tr>
      </thead>
      <tbody>
        {assets.map(asset => {
          const flagCount = asset.action_summaries.find(s => s.__typename === 'FlagAssetActionSummary').actionCount;
          return (
            <tr key={asset.id}>
              <td><a href={asset.url} target="_blank">{asset.title}</a></td>
              <td>{flagCount}</td>
              <td>{asset.commentCount}</td>
            </tr>
          );
        })}
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

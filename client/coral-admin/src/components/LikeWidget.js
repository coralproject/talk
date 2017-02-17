import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import styles from './Widget.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-admin/src/translations';

const lang = new I18n(translations);

const LikeWidget = ({assets}) => {
  return (
    <table className={styles.widgetTable}>
    </table>
  );
};

LikeWidget.propTypes = {
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

export default LikeWidget;

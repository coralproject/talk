import React from 'react';
import { CommentDetail } from 'plugin-api/beta/client/components';
import { isToxic } from '../utils';
import styles from './ToxicDetail.css';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { t } from 'plugin-api/beta/client/services';

const getInfo = (toxicity, actions) => {
  const toxic = isToxic(actions);
  let text = t('talk-plugin-toxic-comments.unlikely');
  if (toxicity > 0.8) {
    text = t('talk-plugin-toxic-comments.highly_likely');
  } else if (toxicity >= 0.5) {
    text = t('talk-plugin-toxic-comments.possibly');
  } else if (toxicity >= 0.7) {
    text = t('talk-plugin-toxic-comments.likely');
  }

  return (
    <div>
      {text}
      <span className={cn(styles.info, { [styles.toxic]: toxic })}>
        {Math.round(toxicity * 100)}%
      </span>
    </div>
  );
};

const ToxicLabel = ({ comment: { actions, toxicity } }) => (
  <CommentDetail
    icon={'add_box'}
    header={t('talk-plugin-toxic-comments.toxic_comment')}
    info={getInfo(toxicity, actions)}
  />
);

ToxicLabel.propTypes = {
  comment: PropTypes.shape({
    actions: PropTypes.array,
    toxicity: PropTypes.toxicity,
  }),
};

export default ToxicLabel;

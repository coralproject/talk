import React from 'react';
import {CommentDetail} from 'plugin-api/beta/client/components';
import {isToxic} from '../utils';
import styles from './ToxicDetail.css';
import cn from 'classnames';
import PropTypes from 'prop-types';

const getInfo = (toxicity, actions) => {
  const toxic = isToxic(actions);
  let text = 'Unlikely';
  if (toxicity > 0.8) {
    text = 'Highly Likely';
  }
  else if (toxicity >= 0.5) {
    text = 'Possibly';
  }
  else if (toxicity >= 0.7) {
    text = 'Likely';
  }

  return (
    <div>
      {text}
      <span className={cn(styles.info, {[styles.toxic]: toxic})}>
        {Math.round(toxicity * 100)}%
      </span>
    </div>
  );
};

const ToxicLabel = ({comment: {actions, toxicity}}) => (
  <CommentDetail
    icon={'add_box'}
    header={'Toxic Comment'}
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

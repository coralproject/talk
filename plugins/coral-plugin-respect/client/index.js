import React from 'react';
import styles from './style.css';
import {Icon} from 'coral-ui';

const getActionSummary = (type, comment) => comment.action_summaries
  .filter((a) => a.__typename === type)[0];

export default (props) => {
  const {comment} = props.context;

  const handleClick = () => {
    props.context.postRespect({
      item_id: comment.id,
      item_type: 'COMMENTS'
    });
  };

  const respectActionSummary = getActionSummary('RespectActionSummary', comment);

  return (
    <div className={styles.Respect} key={props.key}>
      <button
        onClick={handleClick}>
        Respect
        <Icon name="done"/>
        {respectActionSummary ? <span>{respectActionSummary.count}</span> : null}
      </button>
    </div>
  );
};


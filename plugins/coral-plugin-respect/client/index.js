import React from 'react';
import styles from './style.css';
import Icon from './components/Icon';

import {getActionSummary} from 'coral-framework/utils';

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
        <Icon />
        {respectActionSummary ? <span>{respectActionSummary.count}</span> : null}
      </button>
    </div>
  );
};


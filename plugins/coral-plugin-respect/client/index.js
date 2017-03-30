import React from 'react';
import styles from './style.css';
import {Icon} from 'coral-ui';

export default (props) => {
  const handleClick = () => {
    // props.actions.clic     kButton();

    props.context.postRespect({
      item_id: props.context.comment.id,
      item_type: 'COMMENTS'
    });
  };
  const {clicked} = props.state.respect;

  return (
    <div className={styles.Respect} key={props.key}>
      <button
        className={clicked ? styles.clicked : ''}
        onClick={handleClick}>
        Respect
        <Icon name="done"/>
        <span>9</span>
      </button>
    </div>
  );
};


import React from 'react';
import styles from './style.css';
import Icon from './components/Icon';

import {getActionSummary} from 'coral-framework/utils';

class RespectButton extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick = () => {
    const {comment} = this.props.context;

    this.props.context.postRespect({
      item_id: comment.id,
      item_type: 'COMMENTS'
    });
  }
  
  render() {
    const {comment} = this.props.context;
    const respectActionSummary = getActionSummary('RespectActionSummary', comment);

    return (
      <div className={styles.Respect}>
        <button
          onClick={this.handleClick}>
          Respect
          <Icon />
          {respectActionSummary ? <span>{respectActionSummary.count}</span> : null}
        </button>
      </div>
    );
  }
}

export default RespectButton;


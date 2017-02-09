import React, {PropTypes} from 'react';

import Comment from './components/Comment';

const actionsMap = {
  premod: ['reject', 'approve', 'ban']
};

const ModerationQueue = props => {
  return (
    <div>
      <ul>
      {
        props.data[props.activeTab].map((comment, i) => {
          return <Comment
            key={i}
            index={i}
            suspectWords={props.suspectWords}
            actionsMap={actionsMap}
            {...comment}
          />;
        })
      }
      </ul>
    </div>
  );
};

ModerationQueue.propTypes = {
  data: PropTypes.object.isRequired
};

export default ModerationQueue;

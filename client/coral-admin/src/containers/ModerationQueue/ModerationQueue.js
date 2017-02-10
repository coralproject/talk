import React, {PropTypes} from 'react';

import Comment from './components/Comment';

const actionsMap = {
  premod: ['reject', 'approve', 'ban']
};

const ModerationQueue = props => {
  console.log(props);
  return (
    <div>
      <ul>
      {
        props.data[props.activeTab].map((comment, i) => {
          console.log(props.asset);
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

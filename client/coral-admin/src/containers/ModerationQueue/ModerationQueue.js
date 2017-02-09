import React, {PropTypes} from 'react';

import Comment from './components/Comment';

const ModerationQueue = props => {
  return (
    <div>
      <ul>
      {
        props.data[props.activeTab].map((comment, i) => {
          console.log(comment);
          return <Comment
            key={i}
            index={i}
            suspectWords={props.suspectWords}
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

import React, {PropTypes} from 'react';

const NewCount = ({commentCount, countCache}) =>
 <div>
  {
    countCache && commentCount - countCache > 0 &&
    <div>
      Load {commentCount - countCache} More Comments
    </div>
  }
</div>;

NewCount.propTypes = {
  commentCount: PropTypes.number.isRequired,
  countCache: PropTypes.number
};

export default NewCount;

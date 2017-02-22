import React, {PropTypes} from 'react';

const onLoadMoreClick = ({loadMore, commentCount, firstCommentDate, assetId, updateCountCache}) => (e) => {
  e.preventDefault();
  updateCountCache(assetId, commentCount);
  loadMore({
    limit: 500,
    cursor: firstCommentDate,
    assetId,
    sort: 'CHRONOLOGICAL'
  }, true);
};

const NewCount = (props) => {
  const newComments = props.commentCount - props.countCache;

  return <div>
    {
      props.countCache && newComments > 0 &&
      <div onClick={onLoadMoreClick(props)}>
        Load {newComments} More Comments
      </div>
    }
  </div>;
};

NewCount.propTypes = {
  commentCount: PropTypes.number.isRequired,
  countCache: PropTypes.number,
  loadMore: PropTypes.func.isRequired,
  assetId: PropTypes.string.isRequired,
  firstCommentDate: PropTypes.string.isRequired
};

export default NewCount;

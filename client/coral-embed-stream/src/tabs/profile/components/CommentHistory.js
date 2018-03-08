import React from 'react';
import PropTypes from 'prop-types';
import Comment from '../containers/Comment';
import LoadMore from './LoadMore';

class CommentHistory extends React.Component {
  state = {
    loadingState: '',
  };

  loadMore = () => {
    this.setState({ loadingState: 'loading' });
    this.props
      .loadMore()
      .then(() => {
        this.setState({ loadingState: 'success' });
      })
      .catch(() => {
        this.setState({ loadingState: 'error' });
      });
  };

  render() {
    const { navigate, comments, data, root } = this.props;
    return (
      <div className="talk-my-profile-comment-history">
        <div className="commentHistory__list">
          {comments.nodes.map((comment, i) => {
            return (
              <Comment
                key={i}
                data={data}
                root={root}
                comment={comment}
                navigate={navigate}
              />
            );
          })}
        </div>
        {comments.hasNextPage && (
          <LoadMore
            loadMore={this.loadMore}
            loadingState={this.state.loadingState}
          />
        )}
      </div>
    );
  }
}

CommentHistory.propTypes = {
  comments: PropTypes.object.isRequired,
  loadMore: PropTypes.func,
  navigate: PropTypes.func,
  data: PropTypes.object,
  root: PropTypes.object,
};

export default CommentHistory;

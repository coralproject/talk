import React from 'react';
import PropTypes from 'prop-types';
import Comment from './Comment';
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
    const { link, comments, data, root } = this.props;
    return (
      <div>
        <div className="commentHistory__list">
          {comments.nodes.map((comment, i) => {
            return (
              <Comment
                key={i}
                data={data}
                root={root}
                comment={comment}
                link={link}
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
  link: PropTypes.func,
  data: PropTypes.object,
  root: PropTypes.object,
};

export default CommentHistory;

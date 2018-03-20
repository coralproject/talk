import React from 'react';
import Comment from '../containers/Comment';
import LoadMore from './LoadMore';

class TabPane extends React.Component {
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
    const {
      root,
      asset: { featuredComments, ...asset },
      viewComment,
    } = this.props;
    return (
      <div>
        {featuredComments.nodes.map(comment => (
          <Comment
            key={comment.id}
            root={root}
            comment={comment}
            asset={asset}
            viewComment={viewComment}
          />
        ))}
        {featuredComments.hasNextPage && (
          <LoadMore
            loadMore={this.loadMore}
            loadingState={this.state.loadingState}
          />
        )}
      </div>
    );
  }
}

export default TabPane;

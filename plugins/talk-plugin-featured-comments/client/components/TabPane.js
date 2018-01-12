import React from 'react';
import Comment from '../containers/Comment';
import LoadMore from './LoadMore';
import { getErrorMessages } from 'plugin-api/beta/client/utils';

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
      .catch(error => {
        this.setState({ loadingState: 'error' });
        this.props.notify('error', getErrorMessages(error));
      });
  };

  render() {
    const {
      root,
      data,
      asset: { featuredComments, ...asset },
      viewComment,
    } = this.props;
    return (
      <div>
        {featuredComments.nodes.map(comment => (
          <Comment
            key={comment.id}
            root={root}
            data={data}
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

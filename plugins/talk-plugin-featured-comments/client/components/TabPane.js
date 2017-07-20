import React from 'react';
import Comment from '../containers/Comment';
import LoadMore from './LoadMore';
import {forEachError} from 'plugin-api/beta/client/utils';

class TabPane extends React.Component {
  state = {
    loadingState: '',
  };

  loadMore = () => {
    this.setState({loadingState: 'loading'});
    this.props.loadMore()
      .then(() => {
        this.setState({loadingState: 'success'});
      })
      .catch((error) => {
        this.setState({loadingState: 'error'});
        forEachError(error, ({msg}) => {this.props.addNotification('error', msg);});
      });
  }

  render() {
    const {root, data, asset: {featuredComments, ...asset}, viewComment} = this.props;
    return (
      <div>
        {featuredComments.nodes.map((comment) =>
          <Comment
            key={comment.id}
            root={root}
            data={data}
            comment={comment}
            asset={asset}
            viewComment={viewComment} />
        )}
        {featuredComments.hasNextPage &&
          <LoadMore
            loadMore={this.loadMore}
            loadingState={this.loadingState}
          />
        }
      </div>
    );
  }
}

export default TabPane;

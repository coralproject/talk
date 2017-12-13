import React from 'react';
import {Spinner} from 'coral-ui';

class AutoLoadMore extends React.Component {
  componentDidMount() {
    if(!this.props.loading) {
      this.props.loadMore();
    }
  }

  render() {
    return <Spinner />;
  }
}

export default AutoLoadMore;

import React from 'react';
import { Spinner } from 'coral-ui';
import PropTypes from 'prop-types';

/**
 * AutoLoadMore with call `loadMore` the moment it is rendered and shows a Spinner.
 */
class AutoLoadMore extends React.Component {
  componentDidMount() {
    if (!this.props.loading) {
      this.props.loadMore();
    }
  }

  render() {
    return <Spinner />;
  }
}

AutoLoadMore.propTypes = {
  loading: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired,
};

export default AutoLoadMore;

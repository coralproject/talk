import React from 'react';
import {connect} from 'plugin-api/beta/client/hocs';
import {bindActionCreators} from 'redux';
import {sortOrderSelector, sortBySelector} from 'plugin-api/beta/client/selectors/stream';
import {setSort} from 'plugin-api/beta/client/actions/stream';
import hoistStatics from 'recompose/hoistStatics';

const mapStateToProps = (state) => ({
  sortOrder: sortOrderSelector(state),
  sortBy: sortBySelector(state),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setSort
    },
    dispatch
  );

export default ({by = 'created_at', order = 'DESC', label}) => hoistStatics((WrappedComponent) => {
  class WithSortOption extends React.Component {
    setSort = () => {
      this.props.setSort({by, order});
    }

    render() {
      const active = this.props.sortOrder === order && this.props.sortBy === by;
      const resolvedLabel = typeof label === 'function' ? label() : label;
      return (
        <WrappedComponent
          active={active}
          setSort={this.setSort}
          label={resolvedLabel}
        />
      );
    }
  }
  return connect(mapStateToProps, mapDispatchToProps)(WithSortOption);
});

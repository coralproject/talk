import React from 'react';
import { connect } from 'plugin-api/beta/client/hocs';
import { bindActionCreators } from 'redux';
import {
  sortOrderSelector,
  sortBySelector,
} from 'plugin-api/beta/client/selectors/stream';
import { setSort } from 'plugin-api/beta/client/actions/stream';
import hoistStatics from 'recompose/hoistStatics';
import { closeMenu } from 'plugins/talk-plugin-viewing-options/client/actions';

const mapStateToProps = state => ({
  sortOrder: sortOrderSelector(state),
  sortBy: sortBySelector(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setSort,
      closeMenu,
    },
    dispatch
  );

/**
 * A HOC providing props to implement a sort option.
 * Provides the props `active`, `setSort`, `label`.
 * @param  {Object} sort
 * @param  {Object} sort.sortBy
 * @param  {string} sort.sortOrder
 * @return {Object} HOC
 */
export default ({ sortBy = 'created_at', sortOrder = 'DESC', label }) =>
  hoistStatics(WrappedComponent => {
    class WithSortOption extends React.Component {
      setSort = () => {
        this.props.closeMenu();
        this.props.setSort({ sortBy, sortOrder });
      };

      render() {
        const active =
          this.props.sortOrder === sortOrder && this.props.sortBy === sortBy;
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

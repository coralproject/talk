import withSortOption from 'plugin-api/beta/client/hocs/withSortOption';
import SortOption from '../components/SortOption';

/**
 * A factory creating a sort option component.
 * @param  {string|function} label  label to display, can be a callback for lazy evaluation.
 * @param  {Object} sort            sort parameters
 * @param  {string} sort.sortBy
 * @param  {string} sort.sortOrder
 * @return {Object} Component
 */
export const createSortOption = (label, sort) =>
  withSortOption({ ...sort, label })(SortOption);

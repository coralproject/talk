import withSortOption from '../hocs/withSortOption';
import SortOption from '../components/SortOption';

export const createSortOption = (label, sort) => withSortOption({...sort, label})(SortOption);

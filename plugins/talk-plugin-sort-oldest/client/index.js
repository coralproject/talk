import translations from './translations.yml';
import SortOption from './containers/SortOption';
import SortOptionNewest from './containers/SortOptionNewest';

/**
 * talk-plugin-sort-oldest depends on talk-plugin-viewing-options
 * in other to display sort option.
 */

export default {
  translations,
  slots: {
    viewingOptionsSort: [SortOptionNewest, SortOption]
  }
};

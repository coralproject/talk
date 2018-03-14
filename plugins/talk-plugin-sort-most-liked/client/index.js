import translations from './translations.yml';
import { createSortOption } from 'talk-plugin-viewing-options/client/api/factories';
import { t } from 'plugin-api/beta/client/services';

const SortOption = createSortOption(
  () => t('talk-plugin-sort-most-liked.label'),
  { sortBy: 'LIKES', sortOrder: 'DESC' }
);

/**
 * This plugin depends on talk-plugin-viewing-options.
 */

export default {
  translations,
  slots: {
    viewingOptionsSort: [SortOption],
  },
};

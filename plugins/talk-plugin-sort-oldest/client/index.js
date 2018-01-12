import translations from './translations.yml';
import { createSortOption } from 'plugin-api/beta/client/factories';
import { t } from 'plugin-api/beta/client/services';

const SortOption = createSortOption(() => t('talk-plugin-sort-oldest.label'), {
  sortBy: 'CREATED_AT',
  sortOrder: 'ASC',
});

/**
 * This plugin depends on talk-plugin-viewing-options.
 */

export default {
  translations,
  slots: {
    viewingOptionsSort: [SortOption],
  },
};

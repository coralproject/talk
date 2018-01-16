import translations from './translations.yml';
import { createSortOption } from 'plugin-api/beta/client/factories';
import { t } from 'plugin-api/beta/client/services';

const SortOption = createSortOption(() => t('talk-plugin-sort-newest.label'), {
  sortBy: 'CREATED_AT',
  sortOrder: 'DESC',
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

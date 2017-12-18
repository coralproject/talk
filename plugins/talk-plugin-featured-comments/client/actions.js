import {OPEN_FEATURED_DIALOG, CLOSE_FEATURED_DIALOG} from './constants';

export const openFeaturedDialog = () => ({
  type: OPEN_FEATURED_DIALOG
});

export const closeFeaturedDialog = () => ({
  type: CLOSE_FEATURED_DIALOG,
});

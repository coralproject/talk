import {OPEN_FEATURED_DIALOG, CLOSE_FEATURED_DIALOG} from './constants';

export const openFeaturedDialog = (comment, asset) => ({
  type: OPEN_FEATURED_DIALOG,
  comment,
  asset,
});

export const closeFeaturedDialog = () => ({
  type: CLOSE_FEATURED_DIALOG,
});

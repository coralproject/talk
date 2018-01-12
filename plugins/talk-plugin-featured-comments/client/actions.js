import { OPEN_FEATURED_DIALOG, CLOSE_FEATURED_DIALOG } from './constants';

export const openFeaturedDialog = (comment, asset) => ({
  type: OPEN_FEATURED_DIALOG,
  comment: {
    id: comment.id,
    tags: comment.tags,
  },
  asset: {
    id: asset.id,
  },
});

export const closeFeaturedDialog = () => ({
  type: CLOSE_FEATURED_DIALOG,
});

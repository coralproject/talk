import { OPEN_FEATURED_DIALOG, CLOSE_FEATURED_DIALOG } from './constants';

const initialState = {
  showFeaturedDialog: false,
  comment: {
    id: null,
    tags: [],
  },
  asset: {
    id: null,
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_FEATURED_DIALOG:
      return {
        ...state,
        comment: action.comment,
        asset: action.asset,
        showFeaturedDialog: true,
      };
    case CLOSE_FEATURED_DIALOG:
      return {
        ...state,
        featuredCommentId: null,
        showFeaturedDialog: false,
      };
    default:
      return state;
  }
}

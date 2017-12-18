import {OPEN_FEATURED_DIALOG, CLOSE_FEATURED_DIALOG} from './constants';

const initialState = {
  showFeaturedDialog: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case OPEN_FEATURED_DIALOG:
    return {
      ...state,
      showFeaturedDialog: true,
    };
  case CLOSE_FEATURED_DIALOG:
    return {
      ...state,
      showFeaturedDialog: false,
    };
  default :
    return state;
  }
}

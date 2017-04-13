import {ADD_TAG, REMOVE_TAG} from './constants';

const initialState = {
  tags: []
};

export default function commentBox (state = initialState, action) {
  switch (action.type) {
  case ADD_TAG :
    return {
      ...state,
      tags: [...state.tags, action.tag]
    };
  case REMOVE_TAG :
    return {
      ...state,
      tags: [
        ...state.tags.slice(0, action.idx),
        ...state.tags.slice(action.idx + 1)
      ]
    };
  default :
    return state;
  }
}

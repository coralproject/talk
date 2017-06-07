import {ADD_COMMENT_CLASSNAME, REMOVE_COMMENT_CLASSNAME} from '../constants/comment';

const initialState = {
  commentClassNames: []
};

export default function comment (state = initialState, action) {
  switch (action.type) {
  case ADD_COMMENT_CLASSNAME :
    return {
      ...state,
      commentClassNames: [...state.commentClassNames, action.className]
    };
  case REMOVE_COMMENT_CLASSNAME :
    return {
      ...state,
      commentClassNames: [
        ...state.commentClassNames.slice(0, action.idx),
        ...state.commentClassNames.slice(action.idx + 1)
      ]
    };
  default :
    return state;
  }
}

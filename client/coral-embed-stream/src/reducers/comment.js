import {ADD_CLASSNAME, REMOVE_CLASSNAME} from '../constants/comment';

const initialState = {
  classNames: [{
    'wapoOff' : {
      tags: ['OFF_TOPIC']
    }
  }]
};

export default function comment (state = initialState, action) {
  switch (action.type) {
  case ADD_CLASSNAME :
    return {
      ...state,
      classNames: [...state.classNames, action.className]
    };
  case REMOVE_CLASSNAME :
    return {
      ...state,
      classNames: [
        ...state.classNames.slice(0, action.idx),
        ...state.classNames.slice(action.idx + 1)
      ]
    };
  default :
    return state;
  }
}

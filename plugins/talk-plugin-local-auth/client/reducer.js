import * as actions from './constants';

const initialState = {
  inProgress: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.START_ATTACH:
      return {
        inProgress: true,
      };
    case actions.FINISH_ATTACH:
      return {
        inProgress: false,
      };
    default:
      return state;
  }
}

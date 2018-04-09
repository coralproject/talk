import * as actions from '../constants/configure';
import isEmpty from 'lodash/isEmpty';
import update from 'immutability-helper';

const initialState = {
  canSave: false,
  pending: {},
  errors: {},
  saveDialog: false,
};

export default function configure(state = initialState, action) {
  switch (action.type) {
    case actions.SHOW_SAVE_DIALOG: {
      return {
        ...state,
        saveDialog: true,
      };
    }
    case actions.HIDE_SAVE_DIALOG: {
      return {
        ...state,
        saveDialog: false,
      };
    }
    case actions.UPDATE_PENDING: {
      let next = state;
      if (action.updater) {
        next = update(next, {
          pending: action.updater,
        });
      }
      if (action.errorUpdater) {
        next = update(next, {
          errors: action.errorUpdater,
        });
      }
      const noErrors = Object.keys(next.errors).reduce(
        (res, error) => res && !next.errors[error],
        true
      );
      const canSave = !isEmpty(next.pending) && noErrors;
      next = update(next, {
        canSave: { $set: canSave },
      });

      return next;
    }
    case actions.CLEAR_PENDING:
      return {
        ...state,
        pending: {},
        canSave: false,
      };
    default:
      return state;
  }
  return state;
}

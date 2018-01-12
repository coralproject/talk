import * as actions from '../constants/configure';
import isEmpty from 'lodash/isEmpty';
import update from 'immutability-helper';

const initialState = {
  canSave: false,
  pending: {},
  errors: {},
  activeSection: 'stream',
};

export default function configure(state = initialState, action) {
  switch (action.type) {
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
    case actions.SET_ACTIVE_SECTION:
      return {
        ...state,
        activeSection: action.section,
      };
  }
  return state;
}

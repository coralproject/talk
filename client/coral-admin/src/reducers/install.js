import * as actions from '../constants/install';
import update from 'immutability-helper';

const initialState = {
  isLoading: false,
  data: {
    settings: {
      organizationContactEmail: '',
      organizationName: '',
      domains: {
        whitelist: [],
      },
    },
    user: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  },
  errors: {
    organizationName: '',
    organizationContactEmail: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  showErrors: false,
  hasError: false,
  error: null,
  step: 0,
  navItems: [
    {
      text: '1. Add Organization Name',
      step: 1,
    },
    {
      text: '2. Create your account',
      step: 2,
    },
    {
      text: '3. Domain Whitelist',
      step: 3,
    },
  ],
  installRequest: null,
  installRequestError: null,
  alreadyInstalled: false,
};

export default function install(state = initialState, action) {
  switch (action.type) {
    case actions.NEXT_STEP:
      return {
        ...state,
        step: state.step + 1,
      };
    case actions.PREVIOUS_STEP:
      return {
        ...state,
        step: state.step - 1,
      };
    case actions.GO_TO_STEP:
      return {
        ...state,
        step: action.step,
      };
    case actions.UPDATE_PERMITTED_DOMAINS_SETTINGS:
      return update(state, {
        data: {
          settings: {
            domains: {
              whitelist: { $set: action.value },
            },
          },
        },
      });
    case actions.UPDATE_FORMDATA_SETTINGS:
      return update(state, {
        data: {
          settings: {
            [action.name]: { $set: action.value },
          },
        },
      });
    case actions.UPDATE_FORMDATA_USER:
      return update(state, {
        data: {
          user: {
            [action.name]: { $set: action.value },
          },
        },
      });
    case actions.HAS_ERROR:
      return {
        ...state,
        hasError: true,
        showErrors: true,
      };
    case actions.ADD_ERROR:
      return update(state, {
        errors: {
          [action.name]: { $set: action.error },
        },
      });
    case actions.CLEAR_ERRORS:
      return {
        ...state,
        errors: {},
      };
    case actions.INSTALL_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case actions.INSTALL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        installRequest: 'SUCCESS',
      };
    case actions.INSTALL_FAILURE:
      return {
        ...state,
        isLoading: false,
        installRequest: 'FAILURE',
        installRequestError: action.error,
      };
    case actions.CHECK_INSTALL_SUCCESS:
      return {
        ...state,
        alreadyInstalled: action.installed,
      };
    default:
      return state;
  }
}

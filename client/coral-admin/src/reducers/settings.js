import * as actions from '../actions/settings';
import update from 'immutability-helper';

// this is initialized here because
// currently you have to reload the dashboard to get new stats
// cleaner updates are planned in the future.
// TODO: if there are more than two fields for the dashboard being created here,
// please create a new reducer specifically for the Dashboard.
const DASHBOARD_WINDOW_MINUTES = 5;
let then = new Date();
then.setMinutes(then.getMinutes() - DASHBOARD_WINDOW_MINUTES);

const initialState = {
  wordlist: {
    banned: [],
    suspect: []
  },
  dashboardWindowStart: then.toISOString(),
  dashboardWindowEnd: new Date().toISOString(),
  domains: {
    whitelist: []
  },
  saveSettingsError: null,
  fetchSettingsError: null,
  fetchingSettings: false
};

export default function settings (state = initialState, action) {
  switch (action.type) {
  case actions.SETTINGS_LOADING:
    return {
      ...state,
      fetchingSettings: true,
      fetchSettingsError: null,
    };
  case actions.SETTINGS_RECEIVED:
    return {
      ...state,
      fetchingSettings: false,
      fetchSettingsError: null,
      ...action.settings
    };
  case actions.SETTINGS_FETCH_ERROR:
    return {
      ...state,
      fetchingSettings: false,
      fetchSettingsError: action.error,
    };
  case actions.SETTINGS_UPDATED:
    return {
      ...state,
      fetchingSettings: false,
      fetchSettingsError: null,
      ...action.settings
    };
  case actions.SAVE_SETTINGS_LOADING:
    return {
      ...state,
      fetchingSettings: true,
      saveSettingsError: null,
    };
  case actions.SAVE_SETTINGS_SUCCESS:
    return {
      ...state,
      fetchingSettings: false,
      fetchSettingsError: null,
      ...action.settings
    };
  case actions.SAVE_SETTINGS_FAILED:
    return {
      ...state,
      fetchingSettings: false,
      fetchSettingsError: action.error,
    };
  case actions.WORDLIST_UPDATED:
    return update(state, {
      wordlist: {
        [action.listName]: {
          $set: action.list
        }
      }
    });
  case actions.DOMAINLIST_UPDATED:
    return update(state, {
      domains: {
        [action.listName]: {$set: action.list},
      }
    });
  default:
    return state;
  }
}

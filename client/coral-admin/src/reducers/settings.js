import {Map, List} from 'immutable';
import * as types from '../actions/settings';

const initialState = Map({
  settings: Map({
    wordlist: Map({
      banned: List(),
      suspect: List()
    }),
    domains: Map({
      whitelist: List()
    })
  }),
  saveSettingsError: null,
  fetchSettingsError: null,
  fetchingSettings: false
});

// Handle the comment actions
export default (state = initialState, action) => {
  switch (action.type) {
  case types.SETTINGS_LOADING: return state.set('fetchingSettings', true).set('fetchSettingsError', null);
  case types.SETTINGS_RECEIVED: return updateSettings(state, action);
  case types.SETTINGS_FETCH_ERROR: return settingsFetchFailed(state, action);
  case types.SETTINGS_UPDATED: return updateSettings(state, action);
  case types.SAVE_SETTINGS_LOADING: return state.set('fetchingSettings', true).set('saveSettingsError', null);
  case types.SAVE_SETTINGS_SUCCESS: return saveComplete(state, action);
  case types.SAVE_SETTINGS_FAILED: return settingsSaveFailed(state, action);
  case types.WORDLIST_UPDATED: return updateWordlist(state, action);
  case types.DOMAINLIST_UPDATED: return updateDomainlist(state, action);
  default: return state;
  }
};

// only for updating top-level settings
const updateSettings = (state, action) => {
  const s = state.set('fetchingSettings', false).set('fetchSettingsError', null);
  const settings = s.get('settings').merge(action.settings);
  return s.set('settings', settings);
};

// any nested settings must have a specialized setter
const updateWordlist = (state, action) => {
  return state.setIn(['settings', 'wordlist', action.listName], action.list);
};

const updateDomainlist = (state, action) => {
  return state.setIn(['settings', 'domains', action.listName], action.list);
};

const saveComplete = (state, action) => {
  const s = state.set('fetchingSettings', false).set('saveSettingsError', null);
  const settings = s.get('settings').merge(action.settings);
  return s.set('settings', settings);
};

const settingsFetchFailed = (state, action) => {
  return state.set('fetchingSettings', false).set('fetchSettingsError', action.error);
};

const settingsSaveFailed = (state, action) => {
  return state.set('fetchingSettings', false).set('fetchSettingsError', action.error);
};

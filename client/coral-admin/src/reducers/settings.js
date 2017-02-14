import {Map, List} from 'immutable';
import * as actions from '../actions/settings';

const initialState = Map({
  wordlist: Map({
    banned: List(),
    suspect: List()
  }),
  domains: Map({
    whitelist: List()
  }),
  saveSettingsError: null,
  fetchSettingsError: null,
  fetchingSettings: false
});

export default function settings (state = initialState, action) {
  switch (action.type) {
  case actions.SETTINGS_LOADING:
    return state
      .set('fetchingSettings', true)
      .set('fetchSettingsError', null);
  case actions.SETTINGS_RECEIVED:
    return state.merge({
      fetchingSettings: null,
      fetchSettingsError: null,
      ...action.settings
    });
  case actions.SETTINGS_FETCH_ERROR:
    return state
      .set('fetchingSettings', false)
      .set('fetchSettingsError', action.error);
  case actions.SETTINGS_UPDATED:
    return state.merge({
      fetchingSettings: null,
      fetchSettingsError: null,
      ...action.settings
    });
  case actions.SAVE_SETTINGS_LOADING:
    return state
      .set('fetchingSettings', true)
      .set('saveSettingsError', null);
  case actions.SAVE_SETTINGS_SUCCESS:
    return state.merge({
      fetchingSettings: false,
      fetchSettingsError: null,
      ...action.settings
    });
  case actions.SAVE_SETTINGS_FAILED:
    return state
      .set('fetchingSettings', false)
      .set('fetchSettingsError', action.error);
  case actions.WORDLIST_UPDATED:
    return state
      .setIn(['wordlist', action.listName], action.list);
  case actions.DOMAINLIST_UPDATED:
    return state
      .setIn(['domains', action.listName], action.list);
  default:
    return state;
  }
}

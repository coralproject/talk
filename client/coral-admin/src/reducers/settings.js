import { Map } from 'immutable'
import * as types from '../actions/settings'

const initialState = Map({
  settings: Map(),
  saveSettingsError: null,
  fetchSettingsError: null,
  fetchingSettings: false
})

// Handle the comment actions
export default (state = initialState, action) => {
  switch (action.type) {
    case types.SETTINGS_LOADING: return state.set('fetchingSettings', true).set('fetchSettingsError', null)
    case types.SETTINGS_RECEIVED: return receivedSettings(state, action)
    case types.SETTINGS_FETCH_ERROR: return settingsFetchFailed(state, action)
    case types.SETTINGS_UPDAETD: return state.get('settings').merge(action.settings)
    case types.SAVE_SETTINGS_LOADING: return state.set('fetchingSettings', true).set('saveSettingsError', null)
    case types.SAVE_SETTINGS_SUCCESS: return saveComplete(state, action)
    case types.SAVE_SETTINGS_FAILED: return settingsSaveFailed(state, action)
    default: return state
  }
}

const receivedSettings = (state, action) => {
  state.set('fetchingSettings', false).set('fetchSettingsError', null)
  return state.get('settings').merge(action.settings)
}

const saveComplete = (state, action) => {
  state.set('fetchingSettings', false).set('saveSettingsError', null)
  console.log('saveComplete', action.settings)
  return state.get('settings').merge(action.settings)
}

const settingsFetchFailed = (state, action) => {
  return state.set('fetchingSettings', false).set('fetchSettingsError', action.error)
}

const settingsSaveFailed = (state, action) => {
  return state.set('fetchingSettings', false).set('fetchSettingsError', action.error)
}

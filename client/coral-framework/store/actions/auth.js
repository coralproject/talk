/* Auth Actions */

export const SET_LOGGED_IN_USER = 'SET_LOGGED_IN_USER'
export const LOG_OUT_USER = 'LOG_OUT_USER'

export const setLoggedInUser = (user_id) => {
  return {
    type: SET_LOGGED_IN_USER,
    user_id
  }
}

export const LogOutUser = () => {
  return {
    type: LOG_OUT_USER
  }
}

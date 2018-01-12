export const CONFIG_UPDATED = 'CONFIG_UPDATED';

export const fetchConfig = () => dispatch => {
  let json = document.getElementById('data');
  let data = JSON.parse(json.textContent);
  dispatch({ type: CONFIG_UPDATED, data });
};

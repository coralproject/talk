export const PAGE_DATA_UPDATED = 'PAGE_DATA_UPDATED';

export const fetchPageData = () => dispatch => {
  let json = document.getElementById('data');
  let data = JSON.parse(json.textContent);
  dispatch({type: PAGE_DATA_UPDATED, data});
};

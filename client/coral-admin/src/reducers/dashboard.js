// this is initialized here because
// currently you have to reload the dashboard to get new stats
// cleaner updates are planned in the future.
const DASHBOARD_WINDOW_MINUTES = 5;
let then = new Date();
then.setMinutes(then.getMinutes() - DASHBOARD_WINDOW_MINUTES);

const initialState = {
  windowStart: then.toISOString(),
  windowEnd: new Date().toISOString(),
};

export default function dashboard (state = initialState, _action) {
  return state;
}

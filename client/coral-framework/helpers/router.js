import {useBasename} from 'history';
import {browserHistory} from 'react-router';
import {BASE_PATH} from 'coral-framework/constants/url';

export const history = useBasename(() => browserHistory)({
  basename: BASE_PATH
});

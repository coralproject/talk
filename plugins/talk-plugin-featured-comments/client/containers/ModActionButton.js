import {compose} from 'react-apollo';

import Button from '../components/Button';
import {can} from 'plugin-api/beta/client/services';
import {excludeIf, withTags} from 'plugin-api/beta/client/hocs';

const enhance = compose(
  excludeIf((props) => !can(props.user, 'MODERATE_COMMENTS')),
  withTags('featured')
);

export default enhance(Button);

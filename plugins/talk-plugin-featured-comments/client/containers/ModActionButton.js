import {compose} from 'react-apollo';
import {excludeIf} from 'plugin-api/beta/client/hocs';
import {can} from 'plugin-api/beta/client/services';
import Button from '../components/Button';

const enhance = compose(
  excludeIf((props) => !can(props.user, 'MODERATE_COMMENTS')),
);

export default enhance(Button);

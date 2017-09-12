import {compose} from 'react-apollo';
import ModActionButton from '../components/ModActionButton';
import {withTags} from 'plugin-api/beta/client/hocs';

const enhance = compose(
  withTags('featured'),
);

export default enhance(ModActionButton);

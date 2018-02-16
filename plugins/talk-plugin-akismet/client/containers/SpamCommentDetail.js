import { compose } from 'react-apollo';
import { excludeIf } from 'plugin-api/beta/client/hocs';
import SpamDetail from './SpamDetail';
import { isSpam } from '../utils';

const enhance = compose(
  excludeIf(
    ({ comment: { spam, actions } }) => spam === null || !isSpam(actions)
  )
);

export default enhance(SpamDetail);

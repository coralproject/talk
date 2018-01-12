import { compose } from 'react-apollo';
import { withChangeUsername } from 'coral-framework/graphql/mutations';
import ChangeUsername from '../components/ChangeUsername';

export default compose(withChangeUsername)(ChangeUsername);

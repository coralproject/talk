import { compose } from 'recompose';
import { withChangePassword } from 'plugin-api/beta/client/hocs';
import ChangePassword from '../components/ChangePassword';

export default compose(withChangePassword)(ChangePassword);

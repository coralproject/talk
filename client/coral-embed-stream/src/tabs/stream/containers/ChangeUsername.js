import { compose } from 'react-apollo';
import { withChangeUsername } from 'coral-framework/graphql/mutations';
import ChangeUsername from '../components/ChangeUsername';
import { notify } from 'coral-framework/actions/notification';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      notify,
    },
    dispatch
  );

export default compose(connect(null, mapDispatchToProps), withChangeUsername)(
  ChangeUsername
);

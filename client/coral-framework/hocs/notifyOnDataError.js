import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { notify } from 'coral-framework/actions/notification';
import { branch, lifecycle, compose } from 'recompose';
import { get } from 'lodash';

const notifyOnMutationError = compose(
  branch(
    ({ notify }) => !notify,
    connect(null, dispatch =>
      bindActionCreators(
        {
          notify,
        },
        dispatch
      )
    )
  ),
  lifecycle({
    componentWillReceiveProps(next) {
      if (
        get(next, 'data.error.message') &&
        get(this.props, 'data.error.message') !==
          get(next, 'data.error.message')
      ) {
        return this.props.notify('error', next.data.error.message);
      }
    },
  })
);

export default notifyOnMutationError;

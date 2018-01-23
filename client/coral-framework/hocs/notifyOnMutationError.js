import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'react-apollo';
import { notify } from 'coral-framework/actions/notification';
import { forEachError } from 'coral-framework/utils';
import { withProps } from 'recompose';

const notifyOnMutationError = keys =>
  compose(
    connect(null, dispatch =>
      bindActionCreators(
        {
          notify,
        },
        dispatch
      )
    ),
    withProps(ownProps =>
      keys.reduce((props, key) => {
        props[key] = async (...args) => {
          try {
            return await ownProps[key](...args);
          } catch (e) {
            forEachError(e, ({ msg }) => {
              ownProps.notify('error', msg);
            });
            throw e;
          }
        };
        return props;
      }, {})
    )
  );

export default notifyOnMutationError;

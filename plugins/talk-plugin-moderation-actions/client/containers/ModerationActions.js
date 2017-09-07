import React from 'react';
import {gql, compose} from 'react-apollo';
import {connect, excludeIf} from 'plugin-api/beta/client/hocs';
import ModerationActions from '../components/ModerationActions';
import {can} from 'plugin-api/beta/client/services';

const mapStateToProps = ({auth}) => ({
  user: auth.user
});

const enhance = compose(
  connect(mapStateToProps),
  excludeIf((props) => !can(props.user, 'MODERATE_COMMENTS'))
);

export default enhance(ModerationActions);

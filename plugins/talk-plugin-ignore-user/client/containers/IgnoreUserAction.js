import React from 'react';
import IgnoreUserAction from '../components/IgnoreUserAction';
import { compose, gql } from 'react-apollo';
import { connect, withFragments, excludeIf } from 'plugin-api/beta/client/hocs';
import { bindActionCreators } from 'redux';
import { setContentSlot } from 'plugins/talk-plugin-author-menu/client/actions';
import IgnoreUserConfirmation from './IgnoreUserConfirmation';
import { getDefinitionName } from 'plugin-api/beta/client/utils';

class IgnoreUserActionContainer extends React.Component {
  ignoreUser = () => {
    this.props.setContentSlot('ignoreUserConfirmation');
  };

  render() {
    return <IgnoreUserAction ignoreUser={this.ignoreUser} />;
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setContentSlot,
    },
    dispatch
  );

const withIgnoreUserActionFragments = withFragments({
  root: gql`
    fragment TalkIgnoreUser_IgnoreUserAction_root on RootQuery {
      me {
        id
      }
    }
  `,
  comment: gql`
    fragment TalkIgnoreUser_IgnoreUserAction_comment on Comment {
      user {
        id
      }
      ...${getDefinitionName(IgnoreUserConfirmation.fragments.comment)}
    }
    ${IgnoreUserConfirmation.fragments.comment}
  `,
});

const enhance = compose(
  connect(
    null,
    mapDispatchToProps
  ),
  withIgnoreUserActionFragments,
  excludeIf(({ root: { me }, comment }) => !me || me.id === comment.user.id)
);

export default enhance(IgnoreUserActionContainer);

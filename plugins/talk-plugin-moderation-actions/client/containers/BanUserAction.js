import React from 'react';
import { compose } from 'react-apollo';
import { openBanDialog } from '../actions';
import { bindActionCreators } from 'redux';
import BanUserAction from '../components/BanUserAction';
import { connect } from 'plugin-api/beta/client/hocs';

class BanUserActionContainer extends React.Component {
  onBanUser = () => {
    this.props.openBanDialog({
      commentId: this.props.comment.id,
      commentStatus: this.props.comment.status,
      authorId: this.props.comment.user.id,
    });
  };

  render() {
    const { root: { me }, comment } = this.props;
    return me.id !== comment.user.id ? (
      <BanUserAction onBanUser={this.onBanUser} comment={this.props.comment} />
    ) : null;
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      openBanDialog,
    },
    dispatch
  );

const enhance = compose(connect(null, mapDispatchToProps));

export default enhance(BanUserActionContainer);

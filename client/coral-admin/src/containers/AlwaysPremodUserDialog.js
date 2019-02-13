import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AlwaysPremodUserDialog from '../components/AlwaysPremodUserDialog';
import { hideAlwaysPremodUserDialog } from '../actions/alwaysPremodUserDialog';
import { withAlwaysPremodUser } from 'coral-framework/graphql/mutations';
import { compose } from 'react-apollo';
import t from 'coral-framework/services/i18n';

class AlwaysPremodUserDialogContainer extends Component {
  alwaysPremodUser = async () => {
    const { userId, alwaysPremodUser, hideAlwaysPremodUserDialog } = this.props;
    await alwaysPremodUser({ id: userId });
    hideAlwaysPremodUserDialog();
  };

  getInfo() {
    let note = t('alwayspremoddialog.note_always_premod_user');
    return t('alwayspremoddialog.note', note);
  }

  render() {
    return (
      <AlwaysPremodUserDialog
        open={this.props.open}
        onPerform={this.alwaysPremodUser}
        onCancel={this.props.hideAlwaysPremodUserDialog}
        username={this.props.username}
        info={this.getInfo()}
      />
    );
  }
}

AlwaysPremodUserDialogContainer.propTypes = {
  alwaysPremodUser: PropTypes.func.isRequired,
  hideAlwaysPremodUserDialog: PropTypes.func,
  open: PropTypes.bool,
  username: PropTypes.string,
};

const mapStateToProps = ({
  alwaysPremodUserDialog: { open, userId, username },
}) => ({
  open,
  userId,
  username,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      hideAlwaysPremodUserDialog,
    },
    dispatch
  ),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withAlwaysPremodUser
)(AlwaysPremodUserDialogContainer);

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setRole, setCommenterStatus} from '../../../actions/community';
import Table from '../components/Table';
import {viewUserDetail} from '../../../actions/userDetail';
import PropTypes from 'prop-types';

class TableContainer extends Component {

  constructor (props) {
    super(props);
  }

  render () {
    return <Table
      {...this.props}
      onRoleChange={this.props.setRole}
      onCommenterStatusChange={this.props.setCommenterStatus}
      commenters={this.props.commenters}
    />;
  }
}

TableContainer.propTypes = {
  setRole: PropTypes.func,
  setCommenterStatus: PropTypes.func,
  commenters: PropTypes.array,
};

const mapStateToProps = (state) => ({
  commenters: state.community.accounts,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    setCommenterStatus,
    setRole,
    viewUserDetail,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TableContainer);


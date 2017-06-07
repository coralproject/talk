import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose} from 'react-apollo';
import {setRole, setCommenterStatus} from '../../../actions/community';
import Table from '../components/Table';

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

const mapStateToProps = (state) => ({
  commenters: state.community.get('accounts'),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    setCommenterStatus,
    setRole,
  }, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(TableContainer);


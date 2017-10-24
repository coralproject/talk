import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import People from '../components/People';
import PropTypes from 'prop-types';

import {viewUserDetail} from '../../../actions/userDetail';

import {
  fetchUsers,
  updateSorting,
  newPage,
  hideRejectUsernameDialog,
  setCommenterStatus,
  setRole,
} from '../../../actions/community';

class PeopleContainer extends React.Component {
  state = {
    searchValue: '',
    timer: null
  };

  componentWillMount() {
    this.props.fetchUsers();
  }

  onKeyDownHandler = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.search();
    }
  }

  onSearchChange = (e) => {
    const value = e.target.value;

    this.setState((prevState) => {
      prevState.searchValue = value;
      clearTimeout(prevState.timer);
      const fetchAccounts = this.props.fetchUsers;
      prevState.timer = setTimeout(() => {
        fetchAccounts({value});
      }, 350);
      return prevState;
    });
  }

  onHeaderClickHandler = (sort) => {
    this.props.updateSorting(sort);
    this.search();
  }

  onNewPageHandler = ({selected}) => {
    const page = selected + 1;
    this.props.newPage(page);
    this.search({page});
  }

  search(query = {}) {
    const {community} = this.props;

    this.props.fetchUsers({
      value: this.state.searchValue,
      field: community.fieldPeople,
      asc: community.ascPeople,
      ...query
    });
  }
  render() {
    return <People 
      users={this.props.community.users}
      searchValue={this.state.searchValue}
      onSearchChange={this.onSearchChange}
      onHeaderClickHandler={this.onHeaderClickHandler}
      onNewPageHandler={this.onNewPageHandler}
      totalPages={this.props.community.totalPagesPeople}
      setCommenterStatus={this.props.setCommenterStatus}
      setRole={this.props.setRole}
      viewUserDetail={this.props.viewUserDetail}
    />;
  }
}

PeopleContainer.propTypes = {
  newPage: PropTypes.func,
  fetchUsers: PropTypes.func,
  updateSorting: PropTypes.func,
  setRole: PropTypes.func.isRequired,
  setCommenterStatus: PropTypes.func.isRequired,
  viewUserDetail: PropTypes.func.isRequired,
  community: PropTypes.object,
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    newPage,
    fetchUsers,
    updateSorting,
    hideRejectUsernameDialog,
    setCommenterStatus,
    setRole,
    viewUserDetail,
  }, dispatch);

export default connect(null, mapDispatchToProps)(PeopleContainer);

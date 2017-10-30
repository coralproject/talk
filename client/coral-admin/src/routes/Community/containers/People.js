import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import People from '../components/People';
import PropTypes from 'prop-types';

import {viewUserDetail} from '../../../actions/userDetail';

import {
  fetchUsers,
  updateSorting,
  setPage,
  hideRejectUsernameDialog,
  setCommenterStatus,
  setRole,
  setSearchValue,
} from '../../../actions/community';

class PeopleContainer extends React.Component {
  timer=null;

  fetchUsers = (query = {}) => {
    const {community} = this.props;

    this.props.fetchUsers({
      value: community.searchValue,
      field: community.fieldPeople,
      asc: community.ascPeople,
      ...query
    });
  }

  componentWillMount() {
    this.fetchUsers();
  }

  onKeyDownHandler = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.fetchUsers();
    }
  }

  onSearchChange = (e) => {
    const value = e.target.value;

    this.props.setSearchValue(value);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.fetchUsers({value});
    }, 350);
  }

  onHeaderClickHandler = (sort) => {
    this.props.updateSorting(sort);
    this.fetchUsers();
  }

  onPageChange = ({selected}) => {
    const page = selected + 1;
    this.props.setPage(page);
    this.fetchUsers({page});
  }

  render() {
    return <People
      users={this.props.community.users}
      searchValue={this.props.community.searchValue}
      onSearchChange={this.onSearchChange}
      onHeaderClickHandler={this.onHeaderClickHandler}
      onPageChange={this.onPageChange}
      totalPages={this.props.community.totalPagesPeople}
      setCommenterStatus={this.props.setCommenterStatus}
      setRole={this.props.setRole}
      page={this.props.community.pagePeople}
      viewUserDetail={this.props.viewUserDetail}
    />;
  }
}

PeopleContainer.propTypes = {
  setPage: PropTypes.func,
  fetchUsers: PropTypes.func,
  updateSorting: PropTypes.func,
  setRole: PropTypes.func.isRequired,
  setCommenterStatus: PropTypes.func.isRequired,
  setSearchValue: PropTypes.func.isRequired,
  viewUserDetail: PropTypes.func.isRequired,
  community: PropTypes.object,
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    setPage,
    fetchUsers,
    updateSorting,
    hideRejectUsernameDialog,
    setCommenterStatus,
    setRole,
    viewUserDetail,
    setSearchValue,
  }, dispatch);

export default connect(null, mapDispatchToProps)(PeopleContainer);

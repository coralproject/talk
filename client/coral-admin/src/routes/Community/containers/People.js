import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose, gql} from 'react-apollo';
import People from '../components/People';
import PropTypes from 'prop-types';
import {withFragments} from 'plugin-api/beta/client/hocs';
import {withUnBanUser, withUnSuspendUser, withSetUserRole} from 'coral-framework/graphql/mutations';
import {showBanUserDialog} from 'actions/banUserDialog';
import {showSuspendUserDialog} from 'actions/suspendUserDialog';
import {viewUserDetail} from '../../../actions/userDetail';

import {
  fetchUsers,
  updateSorting,
  setPage,
  hideRejectUsernameDialog,
  setSearchValue,
} from '../../../actions/community';

class PeopleContainer extends React.Component {
  timer = null;

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

  setUserRole = async (id, role) => {
    await this.props.setUserRole(id, role);
    await this.fetchUsers();
  }

  render() {
    return <People
      users={this.props.community.users}
      searchValue={this.props.community.searchValue}
      onSearchChange={this.onSearchChange}
      onHeaderClickHandler={this.onHeaderClickHandler}
      onPageChange={this.onPageChange}
      totalPages={this.props.community.totalPagesPeople}
      setUserRole={this.setUserRole}
      page={this.props.community.pagePeople}
      viewUserDetail={this.props.viewUserDetail}
      showSuspendUserDialog={this.props.showSuspendUserDialog}
      showBanUserDialog={this.props.showBanUserDialog}
      unBanUser={this.props.unBanUser}
      unSuspendUser={this.props.unBanUser}
    />;
  }
}

PeopleContainer.propTypes = {
  setPage: PropTypes.func,
  fetchUsers: PropTypes.func,
  updateSorting: PropTypes.func,
  setUserRole: PropTypes.func.isRequired,
  unBanUser: PropTypes.func.isRequired,
  unSuspendUser: PropTypes.func.isRequired,
  setSearchValue: PropTypes.func.isRequired,
  viewUserDetail: PropTypes.func.isRequired,
  community: PropTypes.object,
  showSuspendUserDialog: PropTypes.func,
  showBanUserDialog: PropTypes.func,
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    setPage,
    fetchUsers,
    updateSorting,
    hideRejectUsernameDialog,
    viewUserDetail,
    setSearchValue,
    showSuspendUserDialog,
    showBanUserDialog,
  }, dispatch);

export default compose(
  connect(null, mapDispatchToProps),
  withSetUserRole,
  withUnBanUser,
  withUnSuspendUser,
  withFragments({
    root: gql`
      fragment TalkAdminCommunity_People_root on RootQuery {
        users(query: {}){
          hasNextPage
          endCursor
          nodes {
            __typename
            id
          }
        }
      }

    `,
  }),
)(PeopleContainer);

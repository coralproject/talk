import React, {Component} from 'react';

import CommunityMenu from './CommunityMenu';
import BanUserDialog from './BanUserDialog';
import SuspendUserDialog from './SuspendUserDialog';
import People from './People';
import FlaggedAccounts from './FlaggedAccounts';

export default class Community extends Component {

  state = {
    searchValue: '',
    timer: null
  };

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
      const fetchAccounts = this.props.fetchAccounts;
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

  onNewPageHandler = (page) => {
    this.props.newPage(page);
    this.search({page});
  }

  search(query = {}) {
    const {community} = this.props;

    this.props.fetchAccounts({
      value: this.state.searchValue,
      field: community.fieldPeople,
      asc: community.ascPeople,
      ...query
    });
  }

  getTabContent(searchValue, props) {
    const {community, data} = props;
    const activeTab = props.route.path === ':id' ? 'flagged' : props.route.path;

    if (activeTab === 'people') {
      return (
        <People
          isFetching={community.isFetchingPeople}
          commenters={community.accounts}
          searchValue={searchValue}
          onSearchChange={this.onSearchChange}
          error={community.errorPeople}
          totalPages={community.totalPagesPeople}
          page={community.pagePeople}
          onKeyDown={this.onKeyDownHandler}
          onHeaderClickHandler={this.onHeaderClickHandler}
          onNewPageHandler={this.onNewPageHandler}
        />
      );
    }

    return (
      <div>
        <FlaggedAccounts
          commenters={data.users}
          isFetching={data.loading}
          error={data.error}
          showBanUserDialog={props.showBanUserDialog}
          approveUser={props.approveUser}
          rejectUsername={props.rejectUsername}
          showSuspendUserDialog={props.showSuspendUserDialog}
        />
        <BanUserDialog
          open={community.banDialog}
          user={community.user}
          handleClose={props.hideBanUserDialog}
          handleBanUser={props.banUser}
        />
        <SuspendUserDialog
          open={community.suspendDialog}
          handleClose={props.hideSuspendUserDialog}
          user={community.user}
          rejectUsername={props.rejectUsername}
        />
      </div>
    );
  }

  render() {
    const {searchValue} = this.state;
    const tab = this.getTabContent(searchValue, this.props);

    return (
      <div>
        <CommunityMenu />
        <div>
          { tab }
        </div>
      </div>
    );
  }
}


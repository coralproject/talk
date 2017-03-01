import React, {Component} from 'react';
import {connect} from 'react-redux';
import {modUserFlaggedQuery} from 'coral-admin/src/graphql/queries';
import {compose} from 'react-apollo';
import {
  fetchAccounts,
  updateSorting,
  newPage
} from '../../actions/community';

import CommunityMenu from './components/CommunityMenu';

import People from './People';
import FlaggedAccounts from './FlaggedAccounts';

class CommunityContainer extends Component {

  // static propTypes = {
  //
  //   // list of actions (approve, reject, ban) associated with the users
  //   modActions: PropTypes.arrayOf(PropTypes.string).isRequired,
  // }

  constructor(props) {
    super(props);

    this.state = {
      searchValue: ''
    };

    this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onHeaderClickHandler = this.onHeaderClickHandler.bind(this);
    this.onNewPageHandler = this.onNewPageHandler.bind(this);
  }

  componentWillMount() {
    this.props.fetchAccounts({});
  }

  onKeyDownHandler(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.search();
    }
  }

  onChangeHandler(e) {
    this.setState({
      searchValue: e.target.value
    });
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

  onHeaderClickHandler(sort) {
    this.props.dispatch(updateSorting(sort));
    this.search();
  }

  onNewPageHandler(page) {
    this.props.dispatch(newPage(page));
    this.search({page});
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
          error={community.errorPeople}
          totalPages={community.totalPagesPeople}
          page={community.pagePeople}
          {...this}
        />
      );
    }

    return (
      <FlaggedAccounts
        commenters={data.usersFlagged}
        isFetching={data.loading}
        error={data.error}
        {...this}
      />
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

const mapStateToProps = state => ({
  community: state.community.toJS()
});

const mapDispatchToProps = dispatch => ({
  fetchAccounts: query => dispatch(fetchAccounts(query))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  modUserFlaggedQuery
)(CommunityContainer);

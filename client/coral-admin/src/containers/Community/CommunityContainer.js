import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  fetchCommenters,
  updateSorting,
  newPage,
} from '../../actions/community';

import Community from './Community';

class CommunityContainer extends Component {
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

    this.props.dispatch(fetchCommenters({
      value: this.state.searchValue,
      field: community.field,
      asc: community.asc,
      ...query
    }));
  }

  componentDidMount() {
    this.search();
  }

  onHeaderClickHandler(sort) {
    this.props.dispatch(updateSorting(sort));
    this.search();
  }

  onNewPageHandler(page) {
    this.props.dispatch(newPage(page));
    this.search({page});
  }

  render() {
    const {searchValue} = this.state;
    const {community} = this.props;
    return (
      <Community
        searchValue={searchValue}
        commenters={community.commenters}
        isFetching={community.isFetching}
        error={community.error}
        totalPages={community.totalPages}
        page={community.page}
        {...this}
      />
    );
  }
}

const mapStateToProps = state => ({
  community: state.community.toJS()
});

export default connect(mapStateToProps)(CommunityContainer);

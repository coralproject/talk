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
      field: community.get('field'),
      asc: community.get('asc'),
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
        commenters={community.get('commenters')}
        isFetching={community.get('isFetching')}
        error={community.get('error')}
        totalPages={community.get('totalPages')}
        page={community.get('page')}
        {...this}
      />
    );
  }
}

export default connect(({community}) => ({community}))(CommunityContainer);

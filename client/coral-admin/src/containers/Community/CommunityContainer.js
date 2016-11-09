import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as communityActionCreators from '../../actions/community'

import Community from './Community'

class CommunityContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchValue: '',
      results: []
    }

    this.onKeyDownHandler = this.onKeyDownHandler.bind(this)
    this.onChangeHandler = this.onChangeHandler.bind(this)
  }

  onKeyDownHandler(e) {
    if (e.key === "Enter") {
      this.search()
    }
  }

  onChangeHandler(e) {
    this.setState({
      searchValue: e.target.value
    })
  }

  search() {
    this.props.startFetchCommenters()
  }

  componentDidMount() {
    this.props.startFetchCommenters()
  }

  render() {
    const {searchValue} = this.state;
    const {commenters} = this.props;
    return (
      <Community
        commenters={commenters}
        searchValue={searchValue}
        onKeyDownHandler={this.onKeyDownHandler}
        onChangeHandler={this.onChangeHandler}
        search={this.search}
      />
    )
  }
}

export default connect(
  ({ community }) => community,
  dispatch => bindActionCreators(communityActionCreators, dispatch)
)(CommunityContainer)

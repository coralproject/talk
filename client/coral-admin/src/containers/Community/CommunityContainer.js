import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { fetchCommenters } from '../../actions/community'

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
    this.props.dispatch(fetchCommenters({
      value: this.state.searchValue
    }))
  }

  componentDidMount() {
    this.props.dispatch(fetchCommenters())
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
        {...this}
      />
    )
  }
}

export default connect(({community}) => ({community}))(CommunityContainer)

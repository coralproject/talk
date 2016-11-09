import React, { Component } from 'react'
import { connect } from 'react-redux'

import Community from '../components/Community'

export default class CommunityContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchValue: '',
      results: []
    }

    this.onKeyDownHandler = this.onKeyDownHandler.bind(this)
    this.onChangeHandler = this.onChangeHandler.bind(this)
    this.search = this.search.bind(this)
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
    console.log('search')
  }

  componentDidMount() {
    // Bring results
  }

  render() {
    const {searchValue} = this.state;
    return (
      <Community
        searchValue={searchValue}
        onKeyDownHandler={this.onKeyDownHandler}
        onChangeHandler={this.onChangeHandler}
        search={this.search}
      />
    )
  }
}

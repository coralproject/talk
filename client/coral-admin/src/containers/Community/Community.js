import React, { Component } from 'react'
import { connect } from 'react-redux'
import I18n from 'coral-framework/i18n/i18n'
import translations from '../../translations'
import { Grid, Cell, Button } from 'react-mdl'

import styles from './Community.css'
import Table from './Table'
import Loading from './Loading'

export default class Community extends Component {
  render() {
    const {searchValue, onKeyDownHandler, onChangeHandler, commenters, isFetching} = this.props;
    return (
        <Grid>
          <Cell col={4}>
            <input
              className={styles.searchInput}
              type="text"
              value={searchValue}
              onKeyDown={onKeyDownHandler}
              onChange={onChangeHandler}
            />
            <button className={styles.roleButton}>
              All Users
            </button>
          </Cell>
          <Cell col={8}>
            {
              (isFetching)
              ?
                <Loading />
              :
                <Table
                headers={['Username and Email', 'Account Creation Date']}
                data={commenters}
              />
            }
          </Cell>
        </Grid>
    )
  }
}

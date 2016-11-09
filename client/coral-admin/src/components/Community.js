import React, { Component } from 'react'
import { connect } from 'react-redux'
import I18n from 'coral-framework/i18n/i18n'
import translations from '../translations'
import { Grid, Cell, Button } from 'react-mdl'

import styles from './Community.css'

export default class Community extends Component {
  render() {
    const {searchValue, onKeyDownHandler, onChangeHandler} = this.props;
    console.log(process.env);
    return (
      <div>
        <Grid className="demo-grid-ruler">
          <Cell col={4}>
            <input
              className={styles.searchInput}
              type="text"
              value={searchValue}
              onKeyDown={onKeyDownHandler}
              onChange={onChangeHandler}
            />
            <button className={styles.roleButton}>All Users</button>
          </Cell>
          <Cell col={8}>
            <table className={`mdl-data-table ${styles.dataTable}`}>
              <thead>
              <tr>
                <th>Username and Email</th>
                <th>Account Creation Date</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>
                  Belen Curcio
                  <span>curciobelen@gmail.com</span>
                </td>
                <td>11/07/2016</td>
              </tr>
              </tbody>
            </table>
          </Cell>
        </Grid>
      </div>
    )
  }
}

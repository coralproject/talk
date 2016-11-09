import React, { Component } from 'react'
import { connect } from 'react-redux'
import I18n from 'coral-framework/i18n/i18n'
import translations from '../translations'
import { Grid, Cell, Button } from 'react-mdl'

export default class CommunityContainer extends Component {
  render() {
    return (
      <div>
        <Grid className="demo-grid-ruler">
          <Cell col={4}>
            <input />
            <Button raised colored>Button</Button>
          </Cell>
          <Cell col={8}>
            <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
              <thead>
                <tr>
                  <th class="mdl-data-table__cell--non-numeric">Username and Email</th>
                  <th>Account Creation Date</th>
                </tr>
              </thead>
              <tbody>
              <tr>
                <td class="mdl-data-table__cell--non-numeric">
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

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {SelectField, Option} from 'react-mdl-selectfield';
import styles from './Community.css';
import {setRole, setCommenterStatus} from '../../actions/community';

import t from 'coral-i18n/services/i18n';

class Table extends Component {

  constructor (props) {
    super(props);
    this.onRoleChange = this.onRoleChange.bind(this);
  }

  onRoleChange (id, role) {
    this.props.dispatch(setRole(id, role));
  }

  onCommenterStatusChange (id, status) {
    this.props.dispatch(setCommenterStatus(id, status));
  }

  render () {
    const {headers, commenters, onHeaderClickHandler} = this.props;

    return (
      <table className={`mdl-data-table ${styles.dataTable}`}>
        <thead>
          <tr>
            {headers.map((header, i) =>(
              <th
              key={i}
              className="mdl-data-table__cell--non-numeric"
              onClick={() => onHeaderClickHandler({field: header.field})}>
                {header.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {commenters.map((row, i)=> (
            <tr key={i}>
              <td className="mdl-data-table__cell--non-numeric">
                {row.username}
                <span className={styles.email}>{row.profiles.map(({id}) => id)}</span>
              </td>
              <td className="mdl-data-table__cell--non-numeric">
                {row.created_at}
              </td>
              <td className="mdl-data-table__cell--non-numeric">
                <SelectField label={'Select me'} value={row.status || ''}
                  className={styles.selectField}
                  label={t('community.status')}
                  onChange={(status) => this.onCommenterStatusChange(row.id, status)}>
                  <Option value={'ACTIVE'}>{t('community.active')}</Option>
                  <Option value={'BANNED'}>{t('community.banned')}</Option>
                </SelectField>
              </td>
              <td className="mdl-data-table__cell--non-numeric">
                <SelectField label={'Select me'} value={row.roles[0] || ''}
                  className={styles.selectField}
                  label={t('community.role')}
                  onChange={(role) => this.onRoleChange(row.id, role)}>
                  <Option value={''}>.</Option>
                  <Option value={'MODERATOR'}>{t('community.moderator')}</Option>
                  <Option value={'ADMIN'}>{t('community.admin')}</Option>
                </SelectField>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default connect((state) => ({commenters: state.community.get('accounts')}))(Table);

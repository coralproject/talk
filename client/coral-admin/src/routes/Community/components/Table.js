import React from 'react';
import styles from '../components/Table.css';
import t from 'coral-framework/services/i18n';
import PropTypes from 'prop-types';
import {Dropdown, Option} from 'coral-ui';
import capitalize from 'lodash/capitalize';

const Table = ({headers, commenters, onHeaderClickHandler, onRoleChange, onCommenterStatusChange, viewUserDetail}) => (
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
            <button onClick={() => {viewUserDetail(row.id);}} className={styles.button}>{row.username}</button>
            <span className={styles.email}>{row.profiles.map(({id}) => id)}</span>
          </td>
          <td className="mdl-data-table__cell--non-numeric">
            {row.created_at}
          </td>
          <td className="mdl-data-table__cell--non-numeric">
            <Dropdown 
              value={row.status}
              label={capitalize(row.status)}
              placeholder={t('community.status')}
              onChange={(status) => onCommenterStatusChange(row.id, status)}>     
              <Option value={'ACTIVE'}>{t('community.active')}</Option>
              <Option value={'BANNED'}>{t('community.banned')}</Option>
            </Dropdown>       
          </td>
          <td className="mdl-data-table__cell--non-numeric">
            <Dropdown
              value={row.roles[0] || t('community.none')}
              label={capitalize(row.roles[0]) || t('community.none')}
              placeholder={t('community.role')}
              onChange={(role) => onRoleChange(row.id, role)}>
              <Option value={''}>{t('community.none')}</Option>
              <Option value={'STAFF'}>{t('community.staff')}</Option>
              <Option value={'MODERATOR'}>{t('community.moderator')}</Option>
              <Option value={'ADMIN'}>{t('community.admin')}</Option>
            </Dropdown>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

Table.propTypes = {
  headers: PropTypes.array,
  commenters: PropTypes.array,
  onHeaderClickHandler: PropTypes.func,
  onRoleChange: PropTypes.func,
  onCommenterStatusChange: PropTypes.func,
  viewUserDetail: PropTypes.func,
};

export default Table;

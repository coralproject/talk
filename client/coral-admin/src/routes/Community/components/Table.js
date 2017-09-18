import React from 'react';
import {SelectField, Option} from 'react-mdl-selectfield';
import styles from '../components/Table.css';
import t from 'coral-framework/services/i18n';

export default ({headers, commenters, onHeaderClickHandler, onRoleChange, onCommenterStatusChange, viewUserDetail}) => (
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
            <SelectField
              value={row.status || ''}
              className={styles.selectField}
              label={t('community.status')}
              onChange={(status) => onCommenterStatusChange(row.id, status)}>
              <Option value={'ACTIVE'}>{t('community.active')}</Option>
              <Option value={'BANNED'}>{t('community.banned')}</Option>
            </SelectField>
          </td>
          <td className="mdl-data-table__cell--non-numeric">
            <SelectField
              value={row.roles[0] || ''}
              className={styles.selectField}
              label={t('community.role')}
              onChange={(role) => onRoleChange(row.id, role)}>
              <Option value={''}>.</Option>
              <Option value={'STAFF'}>{t('community.staff')}</Option>
              <Option value={'MODERATOR'}>{t('community.moderator')}</Option>
              <Option value={'ADMIN'}>{t('community.admin')}</Option>
            </SelectField>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

import React from 'react';
import {SelectField, Option} from 'react-mdl-selectfield';
import styles from '../components/Community.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../../translations';

const lang = new I18n(translations);

export default ({headers, commenters, onHeaderClickHandler, onRoleChange, onCommenterStatusChange}) => (
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
              label={lang.t('community.status')}
              onChange={(status) => onCommenterStatusChange(row.id, status)}>
              <Option value={'ACTIVE'}>{lang.t('community.active')}</Option>
              <Option value={'BANNED'}>{lang.t('community.banned')}</Option>
            </SelectField>
          </td>
          <td className="mdl-data-table__cell--non-numeric">
            <SelectField label={'Select me'} value={row.roles[0] || ''}
              className={styles.selectField}
              label={lang.t('community.role')}
              onChange={(role) => onRoleChange(row.id, role)}>
              <Option value={''}>.</Option>
              <Option value={'STAFF'}>{lang.t('community.staff')}</Option>
              <Option value={'MODERATOR'}>{lang.t('community.moderator')}</Option>
              <Option value={'ADMIN'}>{lang.t('community.admin')}</Option>
            </SelectField>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

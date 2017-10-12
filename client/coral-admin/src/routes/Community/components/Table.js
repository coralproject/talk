import React from 'react';
import styles from '../components/Table.css';
import t from 'coral-framework/services/i18n';
import PropTypes from 'prop-types';
import {Dropdown, Option} from 'coral-ui';
import capitalize from 'lodash/capitalize';
import cn from 'classnames';

const Table = ({headers, commenters, onHeaderClickHandler, onRoleChange, onCommenterStatusChange, viewUserDetail}) => (
  <table className={`mdl-data-table ${styles.dataTable}`}>
    <thead>
      <tr>
        {headers.map((header, i) =>(
          <th
            key={i}
            className="mdl-data-table__cell--non-numeric"
            scope="col"
            tabIndex="0"
            onClick={() => onHeaderClickHandler({field: header.field})}>
            {header.title}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {commenters.map((row, i)=> (
        <tr key={i}>
          <td className="mdl-data-table__cell--non-numeric" tabIndex="0">
            <button onClick={() => {viewUserDetail(row.id);}} className={cn(styles.username, styles.button)}>{row.username}</button>
            <span className={styles.email}>{row.profiles.map(({id}) => id)}</span>
          </td>
          <td className="mdl-data-table__cell--non-numeric" tabIndex="0">
            {row.created_at}
          </td>
          <td className="mdl-data-table__cell--non-numeric">
            <Dropdown 
              value={row.status}
              label={capitalize(row.status)}
              placeholder={t('community.status')}
              onChange={(status) => onCommenterStatusChange(row.id, status)}>     
              <Option value={'ACTIVE'} label={t('community.active')} />
              <Option value={'BANNED'} label={t('community.banned')} />
            </Dropdown>       
          </td>
          <td className="mdl-data-table__cell--non-numeric">
            <Dropdown
              value={row.roles[0] || t('community.none')}
              label={capitalize(row.roles[0]) || t('community.none')}
              placeholder={t('community.role')}
              onChange={(role) => onRoleChange(row.id, role)}>
              <Option value={''} label={t('community.none')} />
              <Option value={'STAFF'} label={t('community.staff')} />
              <Option value={'MODERATOR'} label={t('community.moderator')} />
              <Option value={'ADMIN'} label={t('community.admin')} />
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

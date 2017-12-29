import React from 'react';
import styles from './Table.css';
import t from 'coral-framework/services/i18n';
import PropTypes from 'prop-types';
import {Paginate, Dropdown, Option} from 'coral-ui';
import cn from 'classnames';

const headers = [
  {
    title: t('community.username_and_email'),
    field: 'username'
  },
  {
    title: t('community.account_creation_date'),
    field: 'created_at'
  },
  {
    title: t('community.status'),
    field: 'status'
  },
  {
    title: t('community.newsroom_role'),
    field: 'role'
  }
];

const Table = ({users, setRole, onHeaderClickHandler, setCommenterStatus, viewUserDetail, pageCount, page, onPageChange}) => (
  <div>
    <table className={`mdl-data-table ${styles.dataTable}`}>
      <thead>
        <tr>
          {headers.map((header, i) =>(
            <th
              key={i}
              className={cn('mdl-data-table__cell--non-numeric', styles.header)}
              scope="col"
              onClick={() => onHeaderClickHandler({field: header.field})}>
              {header.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {users.map((row, i)=> (
          <tr key={i} className="talk-admin-community-people-row">
            <td className="mdl-data-table__cell--non-numeric">
              <button onClick={() => {viewUserDetail(row.id);}} className={cn(styles.username, styles.button)}>{row.username}</button>
              <span className={styles.email}>{row.profiles.map(({id}) => id)}</span>
            </td>
            <td className="mdl-data-table__cell--non-numeric">
              {row.created_at}
            </td>
            <td className="mdl-data-table__cell--non-numeric">
              <Dropdown
                containerClassName="talk-admin-community-people-dd-status"
                value={row.status}
                placeholder={t('community.status')}
                onChange={(status) => setCommenterStatus(row.id, status)}>
                <Option value={'ACTIVE'} label={t('community.active')} />
                <Option value={'BANNED'} label={t('community.banned')} />
              </Dropdown>
            </td>
            <td className="mdl-data-table__cell--non-numeric">
              <Dropdown
                containerClassName="talk-admin-community-people-dd-role"
                value={row.roles[0] || ''}
                placeholder={t('community.role')}
                onChange={(role) => setRole(row.id, role)}>
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
    <Paginate
      pageCount={pageCount}
      page={page - 1}
      onPageChange={onPageChange}
    />
  </div>
);

Table.propTypes = {
  users: PropTypes.array,
  onHeaderClickHandler: PropTypes.func.isRequired,
  setRole: PropTypes.func.isRequired,
  setCommenterStatus: PropTypes.func.isRequired,
  viewUserDetail: PropTypes.func.isRequired,
  pageCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Table;

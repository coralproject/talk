import React from 'react';
import styles from './Table.css';
import t from 'coral-framework/services/i18n';
import PropTypes from 'prop-types';
import {Paginate, Dropdown, Option} from 'coral-ui';
import cn from 'classnames';
import ActionsMenu from 'coral-admin/src/components/ActionsMenu';
import ActionsMenuItem from 'coral-admin/src/components/ActionsMenuItem';
import {isSuspended, isBanned} from 'coral-framework/utils/user';

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

const Table = (props) => {

  const {
    users,
    setUserRole,
    onHeaderClickHandler,
    viewUserDetail,
    pageCount,
    page,
    onPageChange,
    unSuspendUser,
    unBanUser,
    showSuspendUserDialog,
    showBanUserDialog,
  } = props;

  return (
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
          {users.map((user, i)=> (
            <tr key={i} className="talk-admin-community-people-row">
              <td className="mdl-data-table__cell--non-numeric">
                <button onClick={() => {viewUserDetail(user.id);}} className={cn(styles.username, styles.button)}>{user.username}</button>
                <span className={styles.email}>{user.profiles.map(({id}) => id)}</span>
              </td>
              <td className="mdl-data-table__cell--non-numeric">
                {user.created_at}
              </td>
              <td className="mdl-data-table__cell--non-numeric">
              
                <ActionsMenu
                  icon="person"
                  className={cn(styles.actionsMenu, 'talk-admin-community-people-dd-status')}
                  buttonClassNames={cn({
                    [styles.actionsMenuSuspended]: isSuspended(user),
                    [styles.actionsMenuBanned]: isBanned(user),
                  }, 'talk-admin-user-detail-actions-button')} >

                  {isSuspended(user) ? <ActionsMenuItem
                    onClick={() => unSuspendUser({id: user.id})}>
                    Remove Suspension
                  </ActionsMenuItem> : <ActionsMenuItem
                    onClick={() => showSuspendUserDialog({
                      userId: user.id,
                      username: user.username,
                    })}>
                    Suspend User
                  </ActionsMenuItem>}

                  {isBanned(user) ? <ActionsMenuItem
                    onClick={() => unBanUser({id: user.id})}>
                    Remove Ban
                  </ActionsMenuItem> : <ActionsMenuItem
                    onClick={() => showBanUserDialog({
                      userId: user.id,
                      username: user.username,
                    })}>
                    Ban User
                  </ActionsMenuItem>}

                </ActionsMenu>
              </td>
              <td className="mdl-data-table__cell--non-numeric">
                <Dropdown
                  containerClassName="talk-admin-community-people-dd-role"
                  value={user.role}
                  placeholder={t('community.role')}
                  onChange={(role) => setUserRole(user.id, role)}>
                  <Option value={'COMMENTER'} label={t('community.commenter')} />
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
};

Table.propTypes = {
  users: PropTypes.array,
  onHeaderClickHandler: PropTypes.func.isRequired,
  setUserRole: PropTypes.func.isRequired,
  viewUserDetail: PropTypes.func.isRequired,
  pageCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  showSuspendUserDialog: PropTypes.func,
  showBanUserDialog: PropTypes.func,
  unBanUser: PropTypes.func.isRequired,
  unSuspendUser: PropTypes.func.isRequired,
};

export default Table;

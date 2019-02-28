import React from 'react';
import cn from 'classnames';
import styles from './People.css';
import { Icon, Dropdown, Option } from 'coral-ui';
import EmptyCard from '../../../components/EmptyCard';
import t from 'coral-framework/services/i18n';
import LoadMore from '../../../components/LoadMore';
import PropTypes from 'prop-types';
import ActionsMenu from 'coral-admin/src/components/ActionsMenu';
import ActionsMenuItem from 'coral-admin/src/components/ActionsMenuItem';
import {
  isSuspended,
  isBanned,
  isAlwaysPremod,
} from 'coral-framework/utils/user';
import { RadioGroup, Radio } from 'react-mdl';
import moment from 'moment';
import {
  ADMIN,
  COMMENTER,
  MODERATOR,
  STAFF,
} from 'coral-framework/constants/roles';

const headers = [
  {
    title: t('community.username_and_email'),
    field: 'username',
  },
  {
    title: t('community.account_creation_date'),
    field: 'created_at',
  },
  {
    title: t('community.status'),
    field: 'status',
  },
  {
    title: t('community.newsroom_role'),
    field: 'role',
  },
];

class People extends React.Component {
  getActionMenuLabel = user => {
    if (isBanned(user)) {
      return 'Banned';
    } else if (isSuspended(user)) {
      return 'Suspended';
    } else if (isAlwaysPremod(user)) {
      return 'Always premoderated';
    }
    return '';
  };

  unsuspendUser = input => {
    this.props.unsuspendUser(input);
  };

  unbanUser = input => {
    this.props.unbanUser(input);
  };

  removeAlwaysPremodUser = input => {
    this.props.removeAlwaysPremodUser(input);
  };

  showBanUserDialog = input => {
    this.props.showBanUserDialog(input);
  };

  showSuspendUserDialog = input => {
    this.props.showSuspendUserDialog(input);
  };

  showAlwaysPremodUserDialog = input => {
    this.props.showAlwaysPremodUserDialog(input);
  };

  render() {
    const {
      onFilterChange,
      users = [],
      setUserRole,
      viewUserDetail,
      loadMore,
      filters,
    } = this.props;

    const hasResults = !!users.nodes.length;

    return (
      <div
        className={cn(
          styles.container,
          'talk-admin-community-people-container'
        )}
      >
        <div className={styles.leftColumn}>
          <div className={styles.searchBox}>
            <Icon name="search" className={styles.searchIcon} />
            <input
              id="commenters-search"
              type="text"
              className={styles.searchBoxInput}
              value={filters.search}
              onChange={onFilterChange('search')}
              placeholder={t('streams.search')}
            />
          </div>
          <div className={styles.filterHeader}>
            {t('community.filter_users')}
          </div>
          <div className={styles.filterDetail}>{t('community.status')}</div>
          <RadioGroup
            name="statusFilter"
            value={filters.status}
            childContainer="div"
            onChange={onFilterChange('status')}
            className={styles.radioGroup}
          >
            <Radio value="">{t('community.all')}</Radio>
            <Radio value="active">{t('community.active')}</Radio>
            <Radio value="suspended">{t('community.suspended')}</Radio>
            <Radio value="banned">{t('community.banned')}</Radio>
            <Radio value="alwaysPremod">{t('community.always_premod')}</Radio>
          </RadioGroup>
          <div className={styles.filterDetail}>
            {t('community.filter_role')}
          </div>
          <RadioGroup
            name="roleFilter"
            value={filters.role}
            childContainer="div"
            onChange={onFilterChange('role')}
            className={styles.radioGroup}
          >
            <Radio value="">{t('community.all')}</Radio>
            <Radio value={ADMIN}>{t('community.admin')}</Radio>
            <Radio value={STAFF}>{t('community.staff')}</Radio>
            <Radio value={MODERATOR}>{t('community.moderator')}</Radio>
            <Radio value={COMMENTER}>{t('community.commenter')}</Radio>
          </RadioGroup>
        </div>
        <div className={styles.mainContent}>
          {hasResults ? (
            <div>
              <div>
                <table className={`mdl-data-table ${styles.dataTable}`}>
                  <thead>
                    <tr>
                      {headers.map((header, i) => (
                        <th
                          key={i}
                          className={cn(
                            'mdl-data-table__cell--non-numeric',
                            styles.header
                          )}
                          scope="col"
                        >
                          {header.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.nodes.map(user => (
                      <tr
                        key={user.id}
                        className="talk-admin-community-people-row"
                      >
                        <td className="mdl-data-table__cell--non-numeric">
                          <button
                            onClick={() => {
                              viewUserDetail(user.id);
                            }}
                            className={cn(styles.username, styles.button)}
                          >
                            {user.username}
                          </button>
                          <span className={styles.email}>
                            {user.email
                              ? user.email
                              : user.profiles.map(p => p.id).join(', ')}
                          </span>
                        </td>
                        <td className="mdl-data-table__cell--non-numeric">
                          {moment(new Date(user.created_at)).format(
                            'MMMM Do YYYY, h:mm:ss a'
                          )}
                        </td>
                        <td className="mdl-data-table__cell--non-numeric">
                          <ActionsMenu
                            icon="person"
                            className={cn(
                              styles.actionsMenu,
                              'talk-admin-community-people-dd-status'
                            )}
                            buttonClassNames={cn(
                              styles.actionsMenuButton,
                              {
                                [styles.actionsMenuSuspended]: isSuspended(
                                  user
                                ),
                                [styles.actionsMenuBanned]: isBanned(user),
                                [styles.actionsMenuAlwaysPremod]: isAlwaysPremod(
                                  user
                                ),
                              },
                              'talk-admin-user-detail-actions-button'
                            )}
                            label={this.getActionMenuLabel(user)}
                          >
                            {isSuspended(user) ? (
                              <ActionsMenuItem
                                onClick={() =>
                                  this.unsuspendUser({ id: user.id })
                                }
                              >
                                Remove Suspension
                              </ActionsMenuItem>
                            ) : (
                              <ActionsMenuItem
                                onClick={() =>
                                  this.showSuspendUserDialog({
                                    userId: user.id,
                                    username: user.username,
                                  })
                                }
                              >
                                {t('modqueue.suspend')}
                              </ActionsMenuItem>
                            )}

                            {isBanned(user) ? (
                              <ActionsMenuItem
                                onClick={() => this.unbanUser({ id: user.id })}
                              >
                                Remove Ban
                              </ActionsMenuItem>
                            ) : (
                              <ActionsMenuItem
                                onClick={() =>
                                  this.showBanUserDialog({
                                    userId: user.id,
                                    username: user.username,
                                  })
                                }
                              >
                                {t('modqueue.ban_user_actions')}
                              </ActionsMenuItem>
                            )}

                            {isAlwaysPremod(user) ? (
                              <ActionsMenuItem
                                onClick={() =>
                                  this.removeAlwaysPremodUser({ id: user.id })
                                }
                              >
                                Remove Always Premoderate
                              </ActionsMenuItem>
                            ) : (
                              <ActionsMenuItem
                                onClick={() =>
                                  this.showAlwaysPremodUserDialog({
                                    userId: user.id,
                                    username: user.username,
                                  })
                                }
                              >
                                {t('modqueue.always_premod_user_actions')}
                              </ActionsMenuItem>
                            )}
                          </ActionsMenu>
                        </td>
                        <td className="mdl-data-table__cell--non-numeric">
                          <Dropdown
                            toggleClassName={cn(
                              'talk-admin-community-people-dd-role',
                              styles.roleDropdown
                            )}
                            value={user.role}
                            placeholder={t('community.role')}
                            onChange={role => setUserRole(user.id, role)}
                          >
                            <Option
                              className={styles.roleOption}
                              value={COMMENTER}
                              label={t('community.commenter')}
                            />
                            <Option
                              className={styles.roleOption}
                              value={STAFF}
                              label={t('community.staff')}
                            />
                            <Option
                              className={styles.roleOption}
                              value={MODERATOR}
                              label={t('community.moderator')}
                            />
                            <Option
                              className={styles.roleOption}
                              value={ADMIN}
                              label={t('community.admin')}
                            />
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <LoadMore
                className={styles.loadMore}
                loadMore={loadMore}
                showLoadMore={users.hasNextPage}
              />
            </div>
          ) : (
            <EmptyCard>{t('community.no_results')}</EmptyCard>
          )}
        </div>
      </div>
    );
  }
}

People.propTypes = {
  users: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  setUserRole: PropTypes.func.isRequired,
  viewUserDetail: PropTypes.func.isRequired,
  unbanUser: PropTypes.func.isRequired,
  unsuspendUser: PropTypes.func.isRequired,
  removeAlwaysPremodUser: PropTypes.func.isRequired,
  showSuspendUserDialog: PropTypes.func,
  showBanUserDialog: PropTypes.func,
  showAlwaysPremodUserDialog: PropTypes.func,
  loadMore: PropTypes.func.isRequired,
};

export default People;

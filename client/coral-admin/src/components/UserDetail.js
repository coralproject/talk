import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import styles from './UserDetail.css';
import UserHistory from './UserHistory';
import { Slot } from 'coral-framework/components';
import UserDetailCommentList from '../components/UserDetailCommentList';

import {
  isSuspended,
  isUsernameRejected,
  isUsernameChanged,
  isBanned,
  isAlwaysPremod,
  getKarma,
} from 'coral-framework/utils/user';

import ButtonCopyToClipboard from './ButtonCopyToClipboard';
import ClickOutside from 'coral-framework/components/ClickOutside';
import {
  Icon,
  Drawer,
  Spinner,
  TabBar,
  Tab,
  TabContent,
  TabPane,
} from 'coral-ui';
import ActionsMenu from 'coral-admin/src/components/ActionsMenu';
import ActionsMenuItem from 'coral-admin/src/components/ActionsMenuItem';
import UserInfoTooltip from './UserInfoTooltip';
import KarmaTooltip from './KarmaTooltip';
import t from 'coral-framework/services/i18n';
import { humanizeNumber } from 'coral-framework/helpers/numbers';

const filterOutLocalProfiles = ({ provider }) => provider !== 'local';

/**
 * getUserStatusArray
 * returns an array of active status(es)
 * i.e if suspension is active, it returns suspension
 */

function getUserStatusArray(user) {
  const statusMap = {
    suspended: isSuspended,
    banned: isBanned,
    alwaysPremod: isAlwaysPremod,
    usernameRejected: isUsernameRejected,
    usernameChanged: isUsernameChanged,
  };
  return Object.keys(statusMap).filter(k => statusMap[k](user));
}

class UserDetail extends React.Component {
  changeTab = tab => {
    this.props.changeTab(tab);
  };

  showSuspenUserDialog = () =>
    this.props.showSuspendUserDialog({
      userId: this.props.root.user.id,
      username: this.props.root.user.username,
    });

  showBanUserDialog = () =>
    this.props.showBanUserDialog({
      userId: this.props.root.user.id,
      username: this.props.root.user.username,
    });

  showAlwaysPremodUserDialog = () =>
    this.props.showAlwaysPremodUserDialog({
      userId: this.props.root.user.id,
      username: this.props.root.user.username,
    });

  showRejectUsernameDialog = () =>
    this.props.showRejectUsernameDialog({
      userId: this.props.root.user.id,
      username: this.props.root.user.username,
    });

  renderLoading() {
    return (
      <ClickOutside onClickOutside={this.props.hideUserDetail}>
        <Drawer onClose={this.props.hideUserDetail}>
          <Spinner />
        </Drawer>
      </ClickOutside>
    );
  }

  renderError() {
    return (
      <ClickOutside onClickOutside={this.props.hideUserDetail}>
        <Drawer onClose={this.props.hideUserDetail}>
          <div>{this.props.data.error.message}</div>
        </Drawer>
      </ClickOutside>
    );
  }

  getActionMenuLabel(user) {
    const userStatusArr = getUserStatusArray(user);
    const count = userStatusArr.length;

    if (count > 1) {
      return `Status (${count})`;
    } else {
      const activeStatus = userStatusArr[0];
      switch (activeStatus) {
        case 'suspended':
          return t('user_detail.suspended');
        case 'banned':
          return t('user_detail.banned');
        case 'alwaysPremod':
          return t('user_detail.always_premoded');
        case 'usernameRejected':
          return (
            <span>
              {t('user_detail.username')}
              {` `}
              <Icon name="cancel" />
            </span>
          );
        case 'usernameChanged':
          return (
            <span>
              {t('user_detail.username')}
              {` `}
              <Icon name="access_time" />
            </span>
          );
        default:
          return activeStatus;
      }
    }
  }

  goToReportedUsernames = () => {
    const { router } = this.props;
    router.push('/admin/community/flagged');
  };

  renderLoaded() {
    const {
      root,
      root: {
        me,
        user,
        totalComments,
        rejectedComments,
        settings: { karmaThresholds },
      },
      activeTab,
      selectedCommentIds,
      toggleSelect,
      hideUserDetail,
      viewUserDetail,
      loadMore,
      toggleSelectAll,
      unbanUser,
      unsuspendUser,
      removeAlwaysPremodUser,
      modal,
      acceptComment,
      rejectComment,
      bulkAccept,
      bulkReject,
    } = this.props;

    // if totalComments is 0, you're dividing by zero
    let rejectedPercent = (rejectedComments / totalComments) * 100;

    if (rejectedPercent === Infinity || isNaN(rejectedPercent)) {
      rejectedPercent = 0;
    }

    const banned = isBanned(user);
    const suspended = isSuspended(user);
    const alwaysPremod = isAlwaysPremod(user);
    const usernameRejected = isUsernameRejected(user);
    const usernameChanged = isUsernameChanged(user);

    const slotPassthrough = {
      root,
      user,
    };

    return (
      <ClickOutside onClickOutside={modal ? null : hideUserDetail}>
        <Drawer
          className="talk-admin-user-detail-drawer"
          onClose={hideUserDetail}
        >
          <h3
            className={cn(styles.username, 'talk-admin-user-detail-username')}
          >
            {user.username}
          </h3>

          {user.id && (
            <ActionsMenu
              icon="person"
              className={cn(
                styles.actionsMenu,
                'talk-admin-user-detail-actions-menu'
              )}
              buttonClassNames={cn(
                {
                  [styles.actionsMenuSuspended]: suspended,
                  [styles.actionsMenuBanned]: banned,
                  [styles.actionsMenuAlwaysPremod]: alwaysPremod,
                },
                'talk-admin-user-detail-actions-button'
              )}
              label={this.getActionMenuLabel(user)}
            >
              {suspended ? (
                <ActionsMenuItem onClick={() => unsuspendUser({ id: user.id })}>
                  {t('user_detail.remove_suspension')}
                </ActionsMenuItem>
              ) : (
                <ActionsMenuItem
                  disabled={me.id === user.id}
                  onClick={this.showSuspenUserDialog}
                >
                  {t('user_detail.suspend')}
                </ActionsMenuItem>
              )}

              {banned ? (
                <ActionsMenuItem onClick={() => unbanUser({ id: user.id })}>
                  {t('user_detail.remove_ban')}
                </ActionsMenuItem>
              ) : (
                <ActionsMenuItem
                  disabled={me.id === user.id}
                  onClick={this.showBanUserDialog}
                >
                  {t('user_detail.ban')}
                </ActionsMenuItem>
              )}

              {alwaysPremod ? (
                <ActionsMenuItem
                  onClick={() => removeAlwaysPremodUser({ id: user.id })}
                >
                  {t('user_detail.remove_always_premod')}
                </ActionsMenuItem>
              ) : (
                <ActionsMenuItem
                  disabled={me.id === user.id}
                  onClick={this.showAlwaysPremodUserDialog}
                >
                  {t('user_detail.always_premod')}
                </ActionsMenuItem>
              )}

              {usernameChanged && (
                <ActionsMenuItem onClick={this.goToReportedUsernames}>
                  {t('user_detail.username_needs_approval')}
                  {` `}
                  <Icon name="launch" />
                </ActionsMenuItem>
              )}

              {usernameRejected && !usernameChanged ? (
                <ActionsMenuItem disabled>
                  {t('user_detail.username_rejected')}
                </ActionsMenuItem>
              ) : (
                <ActionsMenuItem
                  onClick={this.showRejectUsernameDialog}
                  disabled={me.id === user.id || usernameChanged}
                >
                  {t('user_detail.reject_username')}
                </ActionsMenuItem>
              )}
            </ActionsMenu>
          )}

          {(banned || suspended) && (
            <UserInfoTooltip
              user={user}
              banned={banned}
              suspended={suspended}
            />
          )}

          <div>
            <ul className={styles.userDetailList}>
              <li className={styles.userDetailItem}>
                <Icon name="perm_identity" />
                <span className={styles.userDetailItem}>
                  {t('user_detail.id')}:
                </span>
                {user.id}{' '}
                <ButtonCopyToClipboard
                  className={styles.copyButton}
                  icon="content_copy"
                  copyText={user.id}
                />
              </li>
              <li className={styles.userDetailItem}>
                <Icon name="assignment_ind" />
                <span className={styles.userDetailItem}>
                  {t('user_detail.member_since')}:
                </span>
                {new Date(user.created_at).toLocaleString()}
              </li>

              <li className={styles.userDetailItem}>
                <Icon name="email" />
                <span className={styles.userDetailItem}>
                  {t('user_detail.email')}:
                </span>
                {user.email}{' '}
                <ButtonCopyToClipboard
                  className={styles.copyButton}
                  icon="content_copy"
                  copyText={user.email}
                />
              </li>

              {user.profiles
                .filter(filterOutLocalProfiles)
                .map(({ provider, id }) => (
                  <li key={id} className={styles.userDetailItem}>
                    <Icon name="device_hub" />
                    <span className={styles.userDetailItem}>
                      {capitalize(provider)} {t('user_detail.id')}:
                    </span>
                    {id}{' '}
                    <ButtonCopyToClipboard
                      className={styles.copyButton}
                      icon="content_copy"
                      copyText={id}
                    />
                  </li>
                ))}
            </ul>

            <ul className={styles.stats}>
              <li className={styles.stat}>
                <span className={styles.statItem}>
                  {t('user_detail.total_comments')}
                </span>
                <span className={styles.statResult}>{totalComments}</span>
              </li>
              <li className={styles.stat}>
                <span className={styles.statItem}>
                  {t('user_detail.reject_rate')}
                </span>
                <span className={styles.statResult}>
                  {rejectedPercent.toFixed(1)}%
                </span>
              </li>
              <li className={cn(styles.stat, styles.karmaStat)}>
                <div>
                  <span className={styles.statItem}>
                    {t('user_detail.karma')}
                  </span>
                  <span
                    className={cn(
                      styles.statKarmaResult,
                      styles[getKarma(user.reliable.commenter)]
                    )}
                  >
                    {humanizeNumber(user.reliable.commenterKarma)}
                  </span>
                </div>
                <KarmaTooltip thresholds={karmaThresholds.comment} />
              </li>
            </ul>
          </div>

          <Slot fill="userProfile" passthrough={slotPassthrough} />

          <hr />

          <TabBar
            onTabClick={this.changeTab}
            activeTab={activeTab}
            className={cn(styles.tabBar, 'talk-admin-user-detail-tab-bar')}
            aria-controls="talk-admin-user-detail-content"
            tabClassNames={{
              button: styles.tabButton,
              buttonActive: styles.tabButtonActive,
            }}
          >
            <Tab
              tabId={'all'}
              className={cn(
                styles.tab,
                styles.button,
                'talk-admin-user-detail-all-tab'
              )}
            >
              {t('user_detail.all')}
            </Tab>
            <Tab
              tabId={'rejected'}
              className={cn(styles.tab, 'talk-admin-user-detail-rejected-tab')}
            >
              {t('user_detail.rejected')}
            </Tab>
            <Tab
              tabId={'history'}
              className={cn(
                styles.tab,
                styles.button,
                'talk-admin-user-detail-history-tab'
              )}
            >
              {t('user_detail.user_history')}
            </Tab>
          </TabBar>

          <TabContent
            activeTab={activeTab}
            className="talk-admin-user-detail-content"
          >
            <TabPane
              tabId={'all'}
              className={'talk-admin-user-detail-all-tab-pane'}
            >
              <UserDetailCommentList
                user={user}
                root={root}
                loadMore={loadMore}
                toggleSelect={toggleSelect}
                viewUserDetail={viewUserDetail}
                acceptComment={acceptComment}
                rejectComment={rejectComment}
                selectedCommentIds={selectedCommentIds}
                toggleSelectAll={toggleSelectAll}
                bulkAcceptThenReload={bulkAccept}
                bulkRejectThenReload={bulkReject}
              />
            </TabPane>
            <TabPane
              tabId={'rejected'}
              className={'talk-admin-user-detail-rejected-tab-pane'}
            >
              <UserDetailCommentList
                user={user}
                root={root}
                loadMore={loadMore}
                toggleSelect={toggleSelect}
                viewUserDetail={viewUserDetail}
                acceptComment={acceptComment}
                rejectComment={rejectComment}
                selectedCommentIds={selectedCommentIds}
                toggleSelectAll={toggleSelectAll}
                bulkAcceptThenReload={bulkAccept}
                bulkRejectThenReload={bulkReject}
              />
            </TabPane>
            <TabPane
              tabId={'history'}
              className={'talk-admin-user-detail-history-tab-pane'}
            >
              <UserHistory user={user} />
            </TabPane>
          </TabContent>
        </Drawer>
      </ClickOutside>
    );
  }

  render() {
    if (this.props.data.error) {
      return this.renderError();
    }

    if (this.props.loading) {
      return this.renderLoading();
    }
    return this.renderLoaded();
  }
}

UserDetail.propTypes = {
  router: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  hideUserDetail: PropTypes.func.isRequired,
  root: PropTypes.object.isRequired,
  acceptComment: PropTypes.func.isRequired,
  rejectComment: PropTypes.func.isRequired,
  changeTab: PropTypes.func.isRequired,
  toggleSelect: PropTypes.func.isRequired,
  bulkAccept: PropTypes.func.isRequired,
  bulkReject: PropTypes.func.isRequired,
  toggleSelectAll: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  data: PropTypes.object,
  activeTab: PropTypes.string.isRequired,
  selectedCommentIds: PropTypes.array.isRequired,
  viewUserDetail: PropTypes.any.isRequired,
  loadMore: PropTypes.any.isRequired,
  showRejectUsernameDialog: PropTypes.func,
  showSuspendUserDialog: PropTypes.func,
  showBanUserDialog: PropTypes.func,
  showAlwaysPremodUserDialog: PropTypes.func,
  unbanUser: PropTypes.func.isRequired,
  unsuspendUser: PropTypes.func.isRequired,
  removeAlwaysPremodUser: PropTypes.func.isRequired,
  modal: PropTypes.bool,
  rejectUsername: PropTypes.func.isRequired,
};

export default UserDetail;

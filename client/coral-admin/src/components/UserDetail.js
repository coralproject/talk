import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import styles from './UserDetail.css';
import UserHistory from './UserHistory';
import { Slot } from 'coral-framework/components';
import UserDetailCommentList from '../components/UserDetailCommentList';
import { isSuspended, isBanned, getKarma } from 'coral-framework/utils/user';
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

  getActionMenuLabel() {
    const { root: { user } } = this.props;

    if (isBanned(user)) {
      return 'Banned';
    } else if (isSuspended(user)) {
      return 'Suspended';
    }

    return '';
  }

  renderLoaded() {
    const {
      root,
      root: { me, user, totalComments, rejectedComments, settings: { karma } },
      activeTab,
      selectedCommentIds,
      toggleSelect,
      hideUserDetail,
      viewUserDetail,
      loadMore,
      toggleSelectAll,
      unbanUser,
      unsuspendUser,
      modal,
      acceptComment,
      rejectComment,
      bulkAccept,
      bulkReject,
    } = this.props;

    // if totalComments is 0, you're dividing by zero
    let rejectedPercent = rejectedComments / totalComments * 100;

    if (rejectedPercent === Infinity || isNaN(rejectedPercent)) {
      rejectedPercent = 0;
    }

    const banned = isBanned(user);
    const suspended = isSuspended(user);

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
                },
                'talk-admin-user-detail-actions-button'
              )}
              label={this.getActionMenuLabel()}
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

              {user.profiles.map(({ provider, id }) => (
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
                    {user.reliable.commenterKarma}
                  </span>
                </div>
                <KarmaTooltip thresholds={karma.comment} />
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
  showSuspendUserDialog: PropTypes.func,
  showBanUserDialog: PropTypes.func,
  unbanUser: PropTypes.func.isRequired,
  unsuspendUser: PropTypes.func.isRequired,
  modal: PropTypes.bool,
};

export default UserDetail;

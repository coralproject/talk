import React from 'react';
import PropTypes from 'prop-types';
import Comment from '../containers/UserDetailComment';
import styles from './UserDetail.css';
import {Icon, Drawer, Spinner} from 'coral-ui';
import {Slot} from 'coral-framework/components';
import ButtonCopyToClipboard from './ButtonCopyToClipboard';
import ClickOutside from 'coral-framework/components/ClickOutside';
import LoadMore from '../components/LoadMore';
import cn from 'classnames';
import capitalize from 'lodash/capitalize';
import {getReliability} from 'coral-framework/utils/user';
import ApproveButton from './ApproveButton';
import RejectButton from './RejectButton';
import {getErrorMessages} from 'coral-framework/utils';
import ActionsMenu from 'coral-admin/src/components/ActionsMenu';
import ActionsMenuItem from 'coral-admin/src/components/ActionsMenuItem';
import UserInfoTooltip from './UserInfoTooltip';
 
class UserDetail extends React.Component {

  rejectThenReload = async (info) => {
    try {
      await this.props.rejectComment(info);
      this.props.data.refetch();
    } catch (err) {

      console.error(err);
      this.props.notify('error', getErrorMessages(err));
    }
  }

  acceptThenReload = async (info) => {
    try {
      await this.props.acceptComment(info);
      this.props.data.refetch();
    } catch (err) {

      console.error(err);
      this.props.notify('error', getErrorMessages(err));
    }
  }

  bulkAcceptThenReload = async () => {
    try {
      await this.props.bulkAccept();
      this.props.data.refetch();
    } catch (err) {

      console.error(err);
      this.props.notify('error', getErrorMessages(err));
    }
  }

  bulkRejectThenReload = async () => {
    try {
      await this.props.bulkReject();
      this.props.data.refetch();
    } catch (err) {

      console.error(err);
      this.props.notify('error', getErrorMessages(err));
    }
  }

  showAll = () => {
    this.props.changeStatus('all');
  }

  showRejected = () => {
    this.props.changeStatus('rejected');
  }

  showSuspenUserDialog = () => this.props.showSuspendUserDialog({
    userId: this.props.root.user.id,
    username: this.props.root.user.username,
  });

  showBanUserDialog = () => this.props.showBanUserDialog({
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

  getActionMenuLabel() {
    const {root: {user}} = this.props;
    
    if (user.status === 'BANNED') {
      return 'Banned';
    } else if (user.suspension.until && new Date(user.suspension.until) > new Date()) {
      return 'Suspended';
    } else {
      return '';
    }
  }

  renderLoaded() {
    const {
      data,
      root,
      root: {
        user,
        totalComments,
        rejectedComments,
        comments: {nodes, hasNextPage}
      },
      activeTab,
      selectedCommentIds,
      toggleSelect,
      hideUserDetail,
      viewUserDetail,
      loadMore,
      toggleSelectAll
    } = this.props;

    let rejectedPercent = (rejectedComments / totalComments) * 100;
    if (rejectedPercent === Infinity || isNaN(rejectedPercent)) {

      // if totalComments is 0, you're dividing by zero, which is naughty
      rejectedPercent = 0;
    }

    const suspended =
      user &&
      user.suspension.until &&
      new Date(user.suspension.until) > new Date();

    const banned = user.status === 'BANNED';

    return (
      <ClickOutside onClickOutside={hideUserDetail}>
        <Drawer className="talk-admin-user-detail-drawer" onClose={hideUserDetail}>
          <h3 className={cn(styles.username, 'talk-admin-user-detail-username')}>
            {user.username}
          </h3>

          {user.id &&
            <ActionsMenu
              icon="person"
              className={cn(styles.actionsMenu, 'talk-admin-user-detail-actions-menu')}
              buttonClassNames={cn({
                [styles.actionsMenuSuspended]: suspended,
                [styles.actionsMenuBanned]: banned,
              }, 'talk-admin-user-detail-actions-button')}
              label={this.getActionMenuLabel()}>

              {suspended && <ActionsMenuItem
                onClick={this.showSuspenUserDialog}>
                Remove Suspension
              </ActionsMenuItem>}

              {banned && <ActionsMenuItem
                onClick={this.showSuspenUserDialog}>
                Remove Ban
              </ActionsMenuItem>}

              {!suspended && <ActionsMenuItem
                onClick={this.showSuspenUserDialog}>
                Suspend User
              </ActionsMenuItem>}

              {!banned && <ActionsMenuItem
                onClick={this.showBanUserDialog}>
                Ban User
              </ActionsMenuItem>}

            </ActionsMenu>
          }

          {banned || suspended && <UserInfoTooltip user={user} banned={banned} suspended={suspended} />}

          <div>
            <ul className={styles.userDetailList}>
              <li>
                <Icon name="assignment_ind" />
                <span className={styles.userDetailItem}>Member Since:</span>
                {new Date(user.created_at).toLocaleString()}
              </li>

              {user.profiles.map(({id}) =>
                <li key={id}>
                  <Icon name="email" />
                  <span className={styles.userDetailItem}>Email:</span>
                  {id} <ButtonCopyToClipboard className={styles.copyButton} icon="content_copy" copyText={id} />
                </li>
              )}
            </ul>

            <ul className={styles.stats}>
              <li className={styles.stat}>
                <span className={styles.statItem}>Total Comments</span>
                <span className={styles.statResult}>{totalComments}</span>
              </li>
              <li className={styles.stat}>
                <span className={styles.statItem}>Reject Rate</span>
                <span className={styles.statResult}>
                  {rejectedPercent.toFixed(1)}%
                </span>
              </li>
              <li className={styles.stat}>
                <span className={styles.statItem}>Reports</span>
                <span className={cn(styles.statReportResult, styles[getReliability(user.reliable.flagger)])}>
                  {capitalize(getReliability(user.reliable.flagger))}
                </span>
              </li>
            </ul>
          </div>

          <Slot
            fill="userProfile"
            data={this.props.data}
            queryData={{root, user}}
          />
          <hr />
          <div className={(selectedCommentIds.length > 0) ? cn(styles.bulkActionHeader, styles.selected) : styles.bulkActionHeader}>
            {
              selectedCommentIds.length === 0
                ? (
                  <ul className={styles.commentStatuses}>
                    <li className={activeTab === 'all' ? styles.active : ''} onClick={this.showAll}>All</li>
                    <li className={activeTab === 'rejected' ? styles.active : ''} onClick={this.showRejected}>Rejected</li>
                  </ul>
                )
                : (
                  <div className={styles.bulkActionGroup}>
                    <ApproveButton
                      onClick={this.bulkAcceptThenReload}
                      minimal
                    />
                    <RejectButton
                      onClick={this.bulkRejectThenReload}
                      minimal
                    />
                    <span className={styles.selectedCommentsInfo}>  {selectedCommentIds.length} comments selected</span>
                  </div>
                )
            }
            <div className={styles.toggleAll}>
              <input
                type='checkbox'
                id='toogleAll'
                checked={selectedCommentIds.length > 0 && selectedCommentIds.length === nodes.length}
                onChange={(e) => {
                  toggleSelectAll(nodes.map((comment) => comment.id), e.target.checked);
                }} />
              <label htmlFor='toogleAll'>Select all</label>
            </div>
          </div>
          <div className={styles.commentList}>
            {
              nodes.map((comment) => {
                const selected = selectedCommentIds.indexOf(comment.id) !== -1;
                return <Comment
                  key={comment.id}
                  user={user}
                  root={root}
                  data={data}
                  comment={comment}
                  acceptComment={this.acceptThenReload}
                  rejectComment={this.rejectThenReload}
                  selected={selected}
                  toggleSelect={toggleSelect}
                  viewUserDetail={viewUserDetail}
                />;
              })
            }
          </div>
          <LoadMore
            className={styles.loadMore}
            loadMore={loadMore}
            showLoadMore={hasNextPage}
          />
        </Drawer>
      </ClickOutside>
    );
  }

  render() {
    if (this.props.loading) {
      return this.renderLoading();
    }
    return this.renderLoaded();
  }
}

UserDetail.propTypes = {
  hideUserDetail: PropTypes.func.isRequired,
  root: PropTypes.object.isRequired,
  acceptComment: PropTypes.func.isRequired,
  rejectComment: PropTypes.func.isRequired,
  changeStatus: PropTypes.func.isRequired,
  toggleSelect: PropTypes.func.isRequired,
  bulkAccept: PropTypes.func.isRequired,
  bulkReject: PropTypes.func.isRequired,
  toggleSelectAll: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    refetch: PropTypes.func.isRequired,
  }),
  activeTab: PropTypes.string.isRequired,
  selectedCommentIds: PropTypes.array.isRequired,
  viewUserDetail: PropTypes.any.isRequired,
  loadMore: PropTypes.any.isRequired,
  notify: PropTypes.func.isRequired,
  showSuspendUserDialog: PropTypes.func,
  showBanUserDialog: PropTypes.func,
};

export default UserDetail;

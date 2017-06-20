import React, {PropTypes} from 'react';
import Comment from './Comment';
import styles from './UserDetail.css';
import {Button, Drawer} from 'coral-ui';
import {Slot} from 'coral-framework/components';
import ButtonCopyToClipboard from './ButtonCopyToClipboard';
import {actionsMap} from '../helpers/moderationQueueActionsMap';

export default class UserDetail extends React.Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    hideUserDetail: PropTypes.func.isRequired,
    root: PropTypes.object.isRequired,
    bannedWords: PropTypes.array.isRequired,
    suspectWords: PropTypes.array.isRequired,
    showBanUserDialog: PropTypes.func.isRequired,
    showSuspendUserDialog: PropTypes.func.isRequired,
    acceptComment: PropTypes.func.isRequired,
    rejectComment: PropTypes.func.isRequired,
    changeStatus: PropTypes.func.isRequired,
    toggleSelect: PropTypes.func.isRequired,
    bulkAccept: PropTypes.func.isRequired,
    bulkReject: PropTypes.func.isRequired,
  }

  rejectThenReload = (info) => {
    this.props.rejectComment(info).then(() => {
      this.props.data.refetch();
    });
  }

  acceptThenReload = (info) => {
    this.props.acceptComment(info).then(() => {
      this.props.data.refetch();
    });
  }

  showAll = () => {
    this.props.changeStatus('all');
  }

  showRejected = () => {
    this.props.changeStatus('rejected');
  }

  showCopied() {
    this.setState({
      emailCopied: true
    }, () => {
      setTimeout(() => this.setState({
        emailCopied: false
      }), 3000);
    });
  }

  render () {
    const {
      root: {
        user,
        totalComments,
        rejectedComments,
        comments: {nodes}
      },
      moderation: {
        userDetailActiveTab: tab,
        userDetailSelectedIds: selectedIds
      },
      bannedWords,
      suspectWords,
      toggleSelect,
      bulkAccept,
      bulkReject,
      showBanUserDialog,
      showSuspendUserDialog,
      hideUserDetail
    } = this.props;
    const localProfile = user.profiles.find((p) => p.provider === 'local');

    let profile;
    if (localProfile) {
      profile = localProfile.id;
    }

    let rejectedPercent = (rejectedComments / totalComments) * 100;
    if (rejectedPercent === Infinity || isNaN(rejectedPercent)) {

      // if totalComments is 0, you're dividing by zero, which is naughty
      rejectedPercent = 0;
    }

    return (
      <Drawer handleClickOutside={hideUserDetail}>
        <h3>{user.username}</h3>

        <div>
          {profile && <input className={styles.profileEmail} readOnly type="text" ref={(ref) => this.profile = ref} value={profile} />}
          <ButtonCopyToClipboard className={styles.copyButton} text={profile} />
        </div>

        <Slot
          fill="userProfile"
          data={this.props.data}
          root={this.props.root}
          user={user}
        />
        <p className={styles.memberSince}><strong>Member since</strong> {new Date(user.created_at).toLocaleString()}</p>
        <hr/>
        <p>
          <strong>Account summary</strong>
          <br/><small className={styles.small}>Data represents the last six months of activity</small>
        </p>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <p>Total Comments</p>
            <p>{totalComments}</p>
          </div>
          <div className={styles.stat}>
            <p>Reject Rate</p>
            <p>{`${(rejectedPercent).toFixed(1)}%`}</p>
          </div>
        </div>
        {
          selectedIds.length === 0
          ? (
            <ul className={styles.commentStatuses}>
              <li className={tab === 'all' ? styles.active : ''} onClick={this.showAll}>All</li>
              <li className={tab === 'rejected' ? styles.active : ''} onClick={this.showRejected}>Rejected</li>
            </ul>
          )
          : (
            <div className={styles.bulkActionGroup}>
              <Button
                onClick={bulkAccept}
                className={styles.bulkAction}
                cStyle='approve'
                icon='done'>
              </Button>
              <Button
                onClick={bulkReject}
                className={styles.bulkAction}
                cStyle='reject'
                icon='close'>
              </Button>
              {`${selectedIds.length} comments selected`}
            </div>
          )
        }

        <div>
          {
            nodes.map((comment, i) => {
              const status = comment.action_summaries ? 'FLAGGED' : comment.status;
              const selected = selectedIds.indexOf(comment.id) !== -1;
              return <Comment
                key={i}
                index={i}
                comment={comment}
                selected={false}
                suspectWords={suspectWords}
                bannedWords={bannedWords}
                viewUserDetail={() => {}}
                actions={actionsMap[status]}
                showBanUserDialog={showBanUserDialog}
                showSuspendUserDialog={showSuspendUserDialog}
                acceptComment={this.acceptThenReload}
                rejectComment={this.rejectThenReload}
                selected={selected}
                toggleSelect={toggleSelect}
                currentAsset={null}
                currentUserId={this.props.id}
                minimal={true} />;
            })
          }
        </div>
      </Drawer>
    );
  }
}

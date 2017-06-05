import React, {PropTypes} from 'react';
import {Button, Drawer} from 'coral-ui';
import styles from './UserDetail.css';
import Slot from 'coral-framework/components/Slot';
import Comment from './Comment';
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
  }

  copyPermalink = () => {
    this.profile.select();
    try {
      document.execCommand('copy');
    } catch (e) {

      /* nothing */
    }
  }

  changeStatus = (tab) => {
    if (tab === 'all') {
      this.props.changeStatus('all');
    } else if (tab === 'rejected') {
      this.props.changeStatus('rejected');
    }
  }

  render () {
    const {
      root: {
        user,
        totalComments,
        rejectedComments,
        comments: {nodes}
      },
      moderation: {userDetailActiveTab: tab},
      bannedWords,
      suspectWords,
      showBanUserDialog,
      showSuspendUserDialog,
      acceptComment,
      rejectComment,
      hideUserDetail
    } = this.props;
    const localProfile = user.profiles.find((p) => p.provider === 'local');

    let profile;
    if (localProfile) {
      profile = localProfile.id;
    }

    let rejectedPercent = rejectedComments / totalComments;
    if (rejectedPercent === Infinity || isNaN(rejectedPercent)) {

      // if totalComments is 0, you're dividing by zero, which is naughty
      rejectedPercent = 0;
    }

    return (
      <Drawer handleClickOutside={hideUserDetail}>
        <h3>{user.username}</h3>
        <Button className={styles.copyButton} onClick={this.copyPermalink}>Copy</Button>
        {profile && <input className={styles.profileEmail} readOnly type="text" ref={(ref) => this.profile = ref} value={profile} />}
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
        <ul className={styles.commentStatuses}>
          <li className={tab === 'all' ? styles.active : ''} onClick={this.changeStatus.bind(this, 'all')}>All</li>
          <li className={tab === 'rejected' ? styles.active : ''} onClick={this.changeStatus.bind(this, 'rejected')}>Rejected</li>
        </ul>
        <div>
          {
            nodes.map((comment, i) => {
              const status = comment.action_summaries ? 'FLAGGED' : comment.status;
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
                acceptComment={acceptComment}
                rejectComment={rejectComment}
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

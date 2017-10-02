import React from 'react';
import PropTypes from 'prop-types';
import Comment from '../containers/UserDetailComment';
import styles from './UserDetail.css';
import {Icon, Button, Drawer, Spinner} from 'coral-ui';
import {Slot} from 'coral-framework/components';
import ButtonCopyToClipboard from './ButtonCopyToClipboard';
import ClickOutside from 'coral-framework/components/ClickOutside';
import LoadMore from '../components/LoadMore';
import cn from 'classnames';
import capitalize from 'lodash/capitalize';
import {getReliability} from 'coral-framework/utils/user';

export default class UserDetail extends React.Component {

  static propTypes = {
    userId: PropTypes.string.isRequired,
    hideUserDetail: PropTypes.func.isRequired,
    root: PropTypes.object.isRequired,
    bannedWords: PropTypes.array.isRequired,
    suspectWords: PropTypes.array.isRequired,
    acceptComment: PropTypes.func.isRequired,
    rejectComment: PropTypes.func.isRequired,
    changeStatus: PropTypes.func.isRequired,
    toggleSelect: PropTypes.func.isRequired,
    bulkAccept: PropTypes.func.isRequired,
    bulkReject: PropTypes.func.isRequired,
  }

  rejectThenReload = async (info) => {
    try {
      await this.props.rejectComment(info);
      this.props.data.refetch();
    } catch (err) {

      // TODO: handle error.
      console.error(err);
    }
  }

  acceptThenReload = async (info) => {
    try {
      await this.props.acceptComment(info);
      this.props.data.refetch();
    } catch (err) {

      // TODO: handle error.
      console.error(err);
    }
  }

  showAll = () => {
    this.props.changeStatus('all');
  }

  showRejected = () => {
    this.props.changeStatus('rejected');
  }

  renderLoading() {
    return (
      <ClickOutside onClickOutside={this.props.hideUserDetail}>
        <Drawer onClose={this.props.hideUserDetail}>
          <Spinner />
        </Drawer>
      </ClickOutside>
    );
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
      bannedWords,
      suspectWords,
      toggleSelect,
      bulkAccept,
      bulkReject,
      hideUserDetail,
      viewUserDetail,
      loadMore,
    } = this.props;

    let rejectedPercent = (rejectedComments / totalComments) * 100;
    if (rejectedPercent === Infinity || isNaN(rejectedPercent)) {

      // if totalComments is 0, you're dividing by zero, which is naughty
      rejectedPercent = 0;
    }

    return (
      <ClickOutside onClickOutside={hideUserDetail}>
        <Drawer onClose={hideUserDetail}>
          <h3>{user.username}</h3>

          <div>
            <ul className={styles.userDetailList}>
              <li>
                <Icon name="assignment_ind"/>
                <span className={styles.userDetailItem}>Member Since:</span>
                {new Date(user.created_at).toLocaleString()}
              </li>

              {user.profiles.map(({id}) =>
                <li key={id}>
                  <Icon name="email"/>
                  <span className={styles.userDetailItem}>Email:</span>
                  {id} <ButtonCopyToClipboard className={styles.copyButton} icon="content_copy" copyText={id} />
                </li>
              )}
            </ul>

            <ul className={styles.stats}>
              <li className={styles.stat}>
                <span className={styles.statItem}> Total Comments </span>
                <spam className={styles.statResult}> {totalComments} </spam>
              </li>
              <li className={styles.stat}>
                <spam className={styles.statItem}> Reject Rate </spam>
                <spam className={styles.statResult}> {`${(rejectedPercent).toFixed(1)}%`} </spam>
              </li>
              <li className={styles.stat}>
                <spam className={styles.statItem}> Reports </spam>
                <spam className={cn(styles.statReportResult, styles[getReliability(user.reliable.flagger)])}>
                  {capitalize(getReliability(user.reliable.flagger))}
                </spam>
              </li>
            </ul>

            <p className={styles.small}>
              Data represents the last six months of activity
            </p>
          </div>

          <Slot
            fill="userProfile"
            data={this.props.data}
            queryData={{root, user}}
          />

          <hr/>
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
                  {`${selectedCommentIds.length} comments selected`}
                </div>
              )
          }

          <div>
            {
              nodes.map((comment) => {
                const selected = selectedCommentIds.indexOf(comment.id) !== -1;
                return <Comment
                  key={comment.id}
                  user={user}
                  root={root}
                  data={data}
                  comment={comment}
                  suspectWords={suspectWords}
                  bannedWords={bannedWords}
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

  render () {
    if (this.props.loading) {
      return this.renderLoading();
    }
    return this.renderLoaded();
  }
}

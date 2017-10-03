import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';

import {Icon} from 'coral-ui';
import CommentDetails from './CommentDetails';
import styles from './UserDetailComment.css';
import CommentBodyHighlighter from 'coral-admin/src/components/CommentBodyHighlighter';
import IfHasLink from 'coral-admin/src/components/IfHasLink';
import cn from 'classnames';
import CommentAnimatedEdit from './CommentAnimatedEdit';
import CommentLabels from '../containers/CommentLabels';
import ApproveButton from './ApproveButton';
import RejectButton from 'coral-admin/src/components/RejectButton';

import t, {timeago} from 'coral-framework/services/i18n';

class UserDetailComment extends React.Component {

  approve = () => (this.props.comment.status === 'ACCEPTED'
    ? null
    : this.props.acceptComment({commentId: this.props.comment.id})
  );

  reject = () => (this.props.comment.status === 'REJECTED'
    ? null
    : this.props.rejectComment({commentId: this.props.comment.id})
  );

  render() {
    const {
      comment,
      suspectWords,
      bannedWords,
      selected,
      toggleSelect,
      className,
      data,
    } = this.props;

    return (
      <li
        tabIndex={0}
        className={cn(className, styles.root, {[styles.rootSelected]: selected})}
      >
        <div className={styles.container}>
          <div className={styles.header}>
            <input
              className={styles.bulkSelectInput}
              type='checkbox'
              value={comment.id}
              checked={selected}
              onChange={(e) => toggleSelect(e.target.value, e.target.checked)} />
            <span className={styles.created}>
              {timeago(comment.created_at)}
            </span>
            {
              (comment.editing && comment.editing.edited)
                ? <span>&nbsp;<span className={styles.editedMarker}>({t('comment.edited')})</span></span>
                : null
            }

            <div className={styles.labels}>
              <CommentLabels comment={comment} />
            </div>
          </div>
          <div className={styles.story}>
            Story: {comment.asset.title}
            {<Link to={`/admin/moderate/${comment.asset.id}`}>{t('modqueue.moderate')}</Link>}
          </div>
          <CommentAnimatedEdit body={comment.body}>
            <div className={styles.bodyContainer}>
              <div className={styles.body}>
                <CommentBodyHighlighter
                  suspectWords={suspectWords}
                  bannedWords={bannedWords}
                  body={comment.body}
                />
                {' '}
                <a
                  className={styles.external}
                  href={`${comment.asset.url}?commentId=${comment.id}`}
                  target="_blank"
                >
                  <Icon name="open_in_new" /> {t('comment.view_context')}
                </a>
              </div>
              <div className={styles.sideActions}>
                <IfHasLink text={comment.body}>
                  <span className={styles.hasLinks}>
                    <Icon name="error_outline" /> Contains Link
                  </span>
                </IfHasLink>
                <div className={styles.actions}>
                  <ApproveButton
                    active={comment.status === 'ACCEPTED'}
                    onClick={this.approve}
                    minimal
                  />
                  <RejectButton
                    active={comment.status === 'REJECTED'}
                    onClick={this.reject}
                    minimal
                  />
                </div>
              </div>
            </div>
          </CommentAnimatedEdit>
        </div>
        <CommentDetails
          data={data}
          root={root}
          comment={comment}
        />
      </li>
    );
  }
}

UserDetailComment.propTypes = {
  user: PropTypes.object.isRequired,
  viewUserDetail: PropTypes.func.isRequired,
  acceptComment: PropTypes.func.isRequired,
  rejectComment: PropTypes.func.isRequired,
  className: PropTypes.string,
  suspectWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  bannedWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleSelect: PropTypes.func,
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    actions: PropTypes.array,
    created_at: PropTypes.string.isRequired,
    asset: PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
      id: PropTypes.string
    })
  })
};

export default UserDetailComment;

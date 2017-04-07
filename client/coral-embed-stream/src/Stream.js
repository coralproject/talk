import React, {PropTypes} from 'react';
import Comment from './Comment';

class Stream extends React.Component {

  static propTypes = {
    addNotification: PropTypes.func.isRequired,
    postItem: PropTypes.func.isRequired,
    asset: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    comments: PropTypes.array.isRequired,
    currentUser: PropTypes.shape({
      username: PropTypes.string,
      id: PropTypes.string
    }),

    // dispatch action to add a tag to a comment
    addCommentTag: PropTypes.func,

    // dispatch action to remove a tag from a comment
    removeCommentTag: PropTypes.func,

    // dispatch action to ignore another user
    ignoreUser: React.PropTypes.func,

    // list of user ids that should be rendered as ignored
    ignoredUsers: React.PropTypes.arrayOf(React.PropTypes.string)
  }

  constructor(props) {
    super(props);
    this.state = {activeReplyBox: '', countPoll: null};
  }

  render () {
    const {
      comments,
      currentUser,
      asset,
      postItem,
      addNotification,
      postFlag,
      postLike,
      open,
      postDontAgree,
      loadMore,
      deleteAction,
      showSignInDialog,
      addCommentTag,
      removeCommentTag,
      pluginProps,
      ignoreUser,
      ignoredUsers,
    } = this.props;
    const commentIsIgnored = (comment) => ignoredUsers && ignoredUsers.includes(comment.user.id);
    return (
      <div id='stream'>
        {
          comments.map(comment =>
            commentIsIgnored(comment)
              ? <IgnoredCommentTombstone
                  key={comment.id}
                />
              : <Comment
                  disableReply={!open}
                  setActiveReplyBox={this.props.setActiveReplyBox}
                  activeReplyBox={this.props.activeReplyBox}
                  addNotification={addNotification}
                  depth={0}
                  postItem={postItem}
                  asset={asset}
                  currentUser={currentUser}
                  postLike={postLike}
                  postFlag={postFlag}
                  postDontAgree={postDontAgree}
                  addCommentTag={addCommentTag}
                  removeCommentTag={removeCommentTag}
                  ignoreUser ={ignoreUser}
                  loadMore={loadMore}
                  deleteAction={deleteAction}
                  showSignInDialog={showSignInDialog}
                  key={comment.id}
                  reactKey={comment.id}
                  comment={comment}
                  pluginProps={pluginProps}
                />
          )
        }
      </div>
    );
  }
}

const IgnoredCommentTombstone = () => (
  <div>
    <hr aria-hidden={true} />
    <p style={{
      backgroundColor: '#F0F0F0',
      textAlign: 'center',
      padding: '1em',
      color: '#3E4F71',
    }}>
      This comment is hidden because you ignored this user.
    </p>
  </div>
);

export default Stream;

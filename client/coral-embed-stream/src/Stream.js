import React, {PropTypes} from 'react';
import Comment from './Comment';

class Stream extends React.Component {

  static propTypes = {
    refetch: PropTypes.func.isRequired,
    addNotification: PropTypes.func.isRequired,
    postItem: PropTypes.func.isRequired,
    asset: PropTypes.object.isRequired,
    comments: PropTypes.array.isRequired,
    currentUser: PropTypes.shape({
      displayName: PropTypes.string,
      id: PropTypes.string
    })
  }

  constructor(props) {
    super(props);
    this.state = {activeReplyBox: ''};
    this.setActiveReplyBox = this.setActiveReplyBox.bind(this);
  }

  setActiveReplyBox (reactKey) {
    if (!this.props.currentUser) {
      const offset = document.getElementById(`c_${reactKey}`).getBoundingClientRect().top - 75;
      this.props.showSignInDialog(offset);
    } else {
      this.setState({activeReplyBox: reactKey});
    }
  }

  render () {
    const {
      comments,
      currentUser,
      asset,
      postItem,
      addNotification,
      postAction,
      deleteAction,
      showSignInDialog,
      refetch
    } = this.props;

    return (
      <div>
        {
          comments.map(comment =>
            <Comment
              refetch={refetch}
              setActiveReplyBox={this.setActiveReplyBox}
              activeReplyBox={this.state.activeReplyBox}
              addNotification={addNotification}
              depth={0}
              postItem={postItem}
              asset={asset}
              currentUser={currentUser}
              postAction={postAction}
              deleteAction={deleteAction}
              showSignInDialog={showSignInDialog}
              key={comment.id}
              reactKey={comment.id}
              comment={comment} />
          )
        }
      </div>
    );
  }
}

export default Stream;

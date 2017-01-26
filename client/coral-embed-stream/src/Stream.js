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
  }

  setActiveReplyBox (reactKey) {
    if (!this.props.currentUser) {
      const offset = document.getElementById(`c_${reactKey}`).getBoundingClientRect().top - 75;
      this.props.showSignInDialog(offset);
    } else if (this.state.activeReplyBox === reactKey) {

      // if the button is clicked again, close the reply box
      this.setState({activeReplyBox: ''});
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
          comments.map(comment => {
            return <Comment
              refetch={refetch}
              replyButtonHandler={() => this.setActiveReplyBox(comment.id)}
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
              comment={comment} />;
          })
        }
      </div>
    );
  }
}

export default Stream;

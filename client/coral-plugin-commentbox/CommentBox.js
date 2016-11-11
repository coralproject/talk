import React, {Component, PropTypes} from 'react';
import {I18n} from '../coral-framework';

const name = 'coral-plugin-commentbox';

class CommentBox extends Component {

  static propTypes = {
    postItem: PropTypes.func,
    updateItem: PropTypes.func,
    id: PropTypes.string,
    comments: PropTypes.array,
    reply: PropTypes.bool
  }

  state = {
    body: '',
    username: ''
  }

  postComment = () => {
    const {postItem, updateItem, id, parent_id, addNotification, appendItemArray} = this.props;
    let comment = {
      body: this.state.body,
      asset_id: id,
      username: this.state.username
    };
    let related;
    let parent_type;
    if (parent_id) {
      comment.parent_id = parent_id;
      related = 'children';
      parent_type = 'comments';
    } else {
      related = 'comments';
      parent_type = 'assets';
    }
    updateItem(parent_id, 'showReply', false, 'comments');
    postItem(comment, 'comments')
    .then((comment_id) => {
      appendItemArray(parent_id || id, related, comment_id, !parent_id, parent_type);
      addNotification('success', 'Your comment has been posted.');
    }).catch((err) => console.error(err));
    this.setState({body: ''});
  }

  render () {
    const {styles, reply} = this.props;
    // How to handle language in plugins? Should we have a dependency on our central translation file?
    return <div>
        <div className={`${name}-container`}>
        <input type='text'
          className={`${name}-username`}
          style={styles && styles.textarea}
          value={this.state.username}
          id={reply ? 'replyUser' : 'commentUser'}
          placeholder='Name'
          onChange={(e) => this.setState({username: e.target.value})}/>
      </div>
      <div
        className={`${name}-container`}>
          <label
            htmlFor={ reply ? 'replyText' : 'commentText'}
            className="screen-reader-text"
            aria-hidden={true}>
            {reply ? lang.t('reply') : lang.t('comment')}
          </label>
          <textarea
            className={`${name}-textarea`}
            style={styles && styles.textarea}
            value={this.state.body}
            placeholder='Comment'
            id={reply ? 'replyText' : 'commentText'}
            onChange={(e) => this.setState({body: e.target.value})}
            rows={3}/>
        </div>
        <div className={`${name}-button-container`}>
          <button
            className={`${name}-button`}
            style={styles && styles.button}
            onClick={this.postComment}>
            {lang.t('post')}
          </button>
      </div>
    </div>;
  }
}

export default CommentBox;

const lang = new I18n({
  en: {
    post: 'Post',
    reply: 'Reply',
    comment: 'Comment',
  },
  es: {
    post: 'Publicar',
    reply: 'Respuesta',
    comment: 'Comentario'
  }
});

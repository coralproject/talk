import React, {Component, PropTypes} from 'react'
import {I18n} from '../coral-framework'

const name='coral-plugin-commentbox'

class CommentBox extends Component {

  static propTypes = {
    postItem: PropTypes.func,
    updateItem: PropTypes.func,
    item_id: PropTypes.string,
    comments: PropTypes.array,
    reply: PropTypes.bool
  }

  state = {
    content: ''
  }

  postComment = () => {
    const {postItem, updateItem, item_id, reply, addNotification, appendItemArray} = this.props
    let comment = {
      content: this.state.content
    }
    let related
    if (reply) {
      comment.parent_id = item_id
      related = 'child'
    } else {
      comment.asset_id = item_id
      related = 'comment'
    }
    updateItem(item_id, 'showReply', false)
    postItem(comment, 'comment')
    .then((id) => {
      appendItemArray(item_id, related, id)
      addNotification('success', 'Your comment has been posted.')
    }).catch((err) => console.error(err))
    this.setState({content: ''})
  }

  render () {
    const {styles, reply} = this.props
    // How to handle language in plugins? Should we have a dependency on our central translation file?
    return <div>
      <div
        className={name + '-container'}
        style={styles && styles.container}>
          <label
            htmlFor={ reply ? 'replyText' : 'commentText'}
            className="screen-reader-text"
            aria-hidden={true}>
            {reply ? 'Reply': 'Comment'}
          </label>
          <textarea
            className={name + '-textarea'}
            style={styles && styles.textarea}
            value={this.state.content}
            id={reply ? 'replyText' : 'commentText'}
            onChange={(e) => this.setState({content: e.target.value})}
            rows={3}/>
        </div>
        <div className={name + '-button-container'}>
          <button
            className={name + '-button'}
            style={styles && styles.button}
            onClick={this.postComment}>
            {lang.t('post')}
          </button>
      </div>
    </div>
  }
}

export default CommentBox

const lang = new I18n({
  en: {
    post: 'Post'
  },
  es: {
    post: 'Publicar'
  }
})

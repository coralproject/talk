import React, {Component, PropTypes} from 'react'
import {
  itemActions,
  Notification,
  notificationActions,
  authActions
} from '../../coral-framework'
import {connect} from 'react-redux'
import CommentBox from '../../coral-plugin-commentbox/CommentBox'
import Content from '../../coral-plugin-commentcontent/CommentContent'
import PubDate from '../../coral-plugin-pubdate/PubDate'
import Count from '../../coral-plugin-comment-count/CommentCount'
import Flag from '../../coral-plugin-flags/FlagButton'
import AuthorName from '../../coral-plugin-author-name/AuthorName'
import {ReplyBox, ReplyButton} from '../../coral-plugin-replies'
import Pym from 'pym.js'

const {addItem, updateItem, postItem, getStream, postAction, appendItemArray} = itemActions
const {addNotification, clearNotification} = notificationActions
const {setLoggedInUser} = authActions

@connect(
  (state) => {
      return {
      config: state.config.toJS(),
      items: state.items.toJS(),
      notification: state.notification.toJS(),
      auth: state.auth.toJS()
    }
  },
  (dispatch) => {
    return {
      addItem: (item) => {
        return dispatch(addItem(item))
      },
      updateItem: (id, property, value) => {
        return dispatch(updateItem(id, property, value))
      },
      postItem: (data, type, id) => {
        return dispatch(postItem(data, type, id))
      },
      getStream: (rootId) => {
        return dispatch(getStream(rootId))
      },
      addNotification: (type, text) => {
        return dispatch(addNotification(type, text))
      },
      clearNotification: () => {
        return dispatch(clearNotification())
      },
      setLoggedInUser: (user_id) => {
        return dispatch(setLoggedInUser(user_id))
      },
      postAction: (item, action, user) => {
        return dispatch(postAction(item, action, user))
      },
      appendItemArray: (item, property, value) => {
        return dispatch(appendItemArray(item, property, value))
      }
    }
  }
)

class CommentStream extends Component {

  static propTypes = {
    items: PropTypes.object.isRequired,
    addItem: PropTypes.func.isRequired,
    updateItem: PropTypes.func.isRequired
  }

  componentDidMount () {
    // Set up messaging between embedded Iframe an parent component
    // Using recommended Pym init code which violates .eslint standards
    new Pym.Child({ polling: 500 })
    this.props.getStream('assetTest')
  }

  render () {
      if (Object.keys(this.props.items).length === 0) {
        // Loading mock asset
        this.props.postItem({
          comments: [],
          url: 'http://coralproject.net'
        }, 'asset', 'assetTest')

        // Loading mock user
        this.props.postItem({name: 'Ban Ki-Moon'}, 'user', 'user_8989')
        .then((id) => {
          this.props.setLoggedInUser(id)
        })
      }


      // TODO: Replace teststream id with id from params



      const rootItemId = 'assetTest'
      const rootItem = this.props.items[rootItemId]
      return <div>
        {
          rootItem ?
            <div>
            <div id="commentBox">
              <Count
                id={rootItemId}
                items={this.props.items}/>
              <CommentBox
                addNotification={this.props.addNotification}
                postItem={this.props.postItem}
                appendItemArray={this.props.appendItemArray}
                updateItem={this.props.updateItem}
                id={rootItemId}/>
            </div>
            {
              rootItem.comments.map((commentId) => {
                const comment = this.props.items[commentId]
                return <div className="comment">
                  <hr aria-hidden={true}/>
                  <AuthorName name={comment.username}/>
                  <PubDate created_at={comment.created_at}/>
                  <Content content={comment.body}/>
                  <div className="commentActions">
                    <Flag
                      addNotification={this.props.addNotification}
                      id={commentId}
                      flag={comment.flag}
                      postAction={this.props.postAction}
                      currentUser={this.props.auth.user}/>
                    <ReplyButton
                      updateItem={this.props.updateItem}
                      id={commentId}/>
                  </div>
                    <ReplyBox
                      addNotification={this.props.addNotification}
                      postItem={this.props.postItem}
                      appendItemArray={this.props.appendItemArray}
                      updateItem={this.props.updateItem}
                      id={commentId}
                      showReply={comment.showReply}/>
                    {
                      comment.children &&
                      comment.children.map((replyId) => {
                      let reply = this.props.items[replyId]
                      return <div className="reply">
                        <hr aria-hidden={true}/>
                        <AuthorName name={reply.username}/>
                        <PubDate created_at={reply.created_at}/>
                        <Content content={reply.body}/>
                        <div className="replyActions">
                          <Flag
                            addNotificiation={this.props.addNotification}
                            id={replyId}
                            flag={reply.flag}
                            postAction={this.props.postAction}
                            currentUser={this.props.auth.user}/>
                          <ReplyButton
                            updateItem={this.props.updateItem}
                            parent_id={reply.parent_id}/>
                        </div>
                      </div>
                    })
                  }
                </div>
              })
            }
            <Notification
              notifLength={this.props.config.notifLength}
              clearNotification={this.props.clearNotification}
              notification={this.props.notification}/>
          </div>
          :'Loading'
        }
      </div>


  }
}

export default CommentStream

import React, {Component, PropTypes} from 'react'
import {
  RootContainer,
  Container,
  MapContainer,
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
import {ReplyBox, ReplyButton} from '../../coral-plugin-replies'
import Pym from 'pym.js'

console.log(authActions);
const {addItem, updateItem, postItem, getItemsQuery, postAction, appendItemRelated} = itemActions
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
      postItem: (host) => (data, type, id) => {
        return dispatch(postItem(data, type, id, host))
      },
      getItemsQuery: (host) => (query, rootId, view) => {
        return dispatch(getItemsQuery(query, rootId, view, host))
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
      postAction: (host) => (item, action, user) => {
        return dispatch(postAction(item, action, user, host))
      },
      appendItemRelated: (item, property, value) => {
        return dispatch(appendItemRelated(item, property, value))
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
  }

  render () {
    if (this.props.config.coralHost) {
      const host = this.props.config.coralHost
      if (Object.keys(this.props.items).length === 0) {
        // Loading mock asset
        this.props.postItem(host)({
          comments: [],
          url: 'http://coralproject.net'
        }, 'asset', 'assetTest')

        // Loading mock user
        this.props.postItem(host)({name: 'Ban Ki-Moon'}, 'user', 'user_8989')
        .then((id) => {
          this.props.setLoggedInUser(id)
        })
      }


      // TODO: Replace teststream id with id from params

      return <RootContainer
        items={this.props.items}
        view={this.props.config.view}
        rootId='assetTest'
        type='asset'
        query={this.props.config.query}
        getItemsQuery={this.props.getItemsQuery(host)}>
        <Container name="commentBox">
          <Count data="{item_id,comment(type:'comment'){item_id,child(type:'comment'){item_id}}}"/>
          <CommentBox
            addNotification={this.props.addNotification}
            postItem={this.props.postItem(host)}
            appendItemRelated={this.props.appendItemRelated}
            updateItem={this.props.updateItem}
            data="{item_id}"/>
        </Container>
        <MapContainer mapOver="comment" itemType="comment">
          <Container name="comment">
            <hr aria-hidden={true}/>
            <PubDate data="{created_at}"/>
            <Content data="{content}"/>
            <Container name="commentActions">
              <Flag
                addNotification={this.props.addNotification}
                data="{item_id,flag}"
                postAction={this.props.postAction(host)}
                currentUser={this.props.auth.user}/>
              <ReplyButton
                updateItem={this.props.updateItem}
                data="{item_id}"/>
            </Container>
              <ReplyBox
                addNotification={this.props.addNotification}
                postItem={this.props.postItem(host)}
                appendItemRelated={this.props.appendItemRelated}
                updateItem={this.props.updateItem}
                data="{item_id,showReply}"/>
              <MapContainer mapOver="child" itemType="comment">
                <Container name="reply">
                  <hr aria-hidden={true}/>
                  <PubDate data="{created_at}"/>
                  <Content data="{content}"/>
                  <Container name="replyActions">
                    <Flag
                      addNotificiation={this.props.addNotification}
                      data="{item_id,flag}"
                      postAction={this.props.postAction(host)}
                      currentUser={this.props.auth.user}/>
                    <ReplyButton
                      updateItem={this.props.updateItem}
                      data="{parent_id}"/>
                  </Container>
                </Container>
              </MapContainer>
          </Container>
        </MapContainer>
        <Notification
          notifLength={this.props.config.notifLength}
          clearNotification={this.props.clearNotification}
          notification={this.props.notification}/>
      </RootContainer>
    } else {
      return <div>Loading</div>
    }
  }
}

export default CommentStream

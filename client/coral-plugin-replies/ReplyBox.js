import React from 'react'
import CommentBox from '../coral-plugin-commentbox/CommentBox'

const name = 'coral-plugin-replies'

const ReplyBox = (props) => <div
   className={name + '-textarea'}
   style={props.styles && props.styles.container}>
     {
       props.showReply && <CommentBox
         item_id = {props.item_id}
         postItem = {props.postItem}
         addNotification = {props.addNotification}
         appendItemRelated = {props.appendItemRelated}
         updateItem = {props.updateItem}
         comments = {props.child}
         reply = {true}/>
     }
   </div>

export default ReplyBox

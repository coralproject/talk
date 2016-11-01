import React from 'react'

const name = 'coral-plugin-comment-count'

const CommentCount = ({comment}) => {
  let count = 0
  if (comment) {
    count += comment.length
    for (var i=0; i < comment.length; i++) {
      if (comment[i].child) {
        count += comment[i].child.length
      }
    }
  }

  return <div className={name + '-text'}>
    {count + ' ' + (count === 1 ? 'Comment':'Comments')}
  </div>
}

export default CommentCount

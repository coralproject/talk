import React from 'react'

const name = 'coral-plugin-comment-count'

const CommentCount = ({items, item_id}) => {
  let count = 0
  if (items[item_id]) {
    count += items[item_id].related.comment.length
  }
  const itemKeys = Object.keys(items)
  for (var i=0; i < itemKeys.length; i++) {
    const item = items[itemKeys[i]]
    if (item.type === 'comment' && item.related && item.related.child) {
      count += item.related.child.length
    }
  }

  return <div className={name + '-text'}>
    {count + ' ' + (count === 1 ? 'Comment':'Comments')}
  </div>
}

export default CommentCount

import React from 'react'

const name = 'coral-plugin-comment-count'

const CommentCount = ({items, id}) => {
  let count = 0
  if (items[id]) {
    count += items[id].comments.length
  }
  const itemKeys = Object.keys(items)
  for (var i=0; i < itemKeys.length; i++) {
    const item = items[itemKeys[i]]
    if (item.children) {
      count += item.children.length
    }
  }

  return <div className={name + '-text'}>
    {count + ' ' + (count === 1 ? 'Comment':'Comments')}
  </div>
}

export default CommentCount

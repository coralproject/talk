
/**
 * The adapter is a redux middleware that interecepts the actions that need
 * to interface with the backend, do the job and return the results.
 * The idea is that if we expose the required actions to handle to devs, the
 * moderation app can be platform agnostic. This same client could work not only
 * for the coral but also for wordpress comments, disqus and many more.
 */

import { talkHost, xeniaHost } from 'services/config'
import XeniaDriver from 'xenia-driver'

// Intercept redux actions and act over the ones we are interested
export default store => next => action => {
  switch (action.type) {
    case 'COMMENTS_MODERATION_QUEUE_FETCH':
      fetchModerationQueueComments(store)
      break
    case 'COMMENT_STREAM_FETCH':
      fetchCommentStream(store)
      break
    case 'COMMENT_UPDATE':
      updateComment(store, action.comment)
      break
    case 'COMMENT_CREATE':
      createComment(store, action.name, action.body)
      break
  }

  next(action)
}

// Setup xenia driver
const xenia = XeniaDriver(`${xeniaHost}/v1`, {username: 'user', password: 'pass'})

// Get comments to fill each of the three lists on the mod queue
const fetchModerationQueueComments = store => xenia()
.collection('items')
.match({type: 'comment', 'data.status': 'Untouched', 'data.createdAt': { $exists: true }})
.sort(['data.createdAt', 1])
.skip(0).limit(50)
.addQuery().collection('items')
.match({type: 'comment', 'data.status': 'Rejected', 'data.createdAt': { $exists: true }})
.sort(['data.createdAt', 1])
.skip(0).limit(50)
.addQuery().collection('items')
.match({type: 'comment', 'data.status': 'Untouched', 'data.flagged': true, 'data.createdAt': { $exists: true }})
.sort(['data.createdAt', 1])
.skip(0).limit(50)
.exec()
.then(res => store.dispatch({ type: 'COMMENTS_MODERATION_QUEUE_FETCH_SUCCESS',
  comments: res.results.map(res => res.Docs).reduce((p, c) => p.concat(c), []) }))
.catch(error => store.dispatch({ type: 'COMMENTS_MODERATION_QUEUE_FETCH_FAILED', error }))

// Update a comment. Now to update a comment we need to send back the whole object
const updateComment = (store, comment) =>
fetch(`${talkHost}/v1/item`, {
  method: 'PUT',
  mode: 'cors',
  body: JSON.stringify(comment)
})
.then(res => store.dispatch({ type: 'COMMENT_UPDATE_SUCCESS', res }))
.catch(error => store.dispatch({ type: 'COMMENT_UPDATE_FAILED', error }))

// Create a new comment
const createComment = (store, name, comment) =>
fetch(`${talkHost}/v1/item`, {
  method: 'POST',
  mode: 'cors',
  body: JSON.stringify({
    type: 'comment',
    version: 1,
    data: {
      status: 'Untouched',
      body: comment,
      name: name,
      createdAt: Date.now()
    }
  })
}).then(res => res.json())
.then(res => store.dispatch({ type: 'COMMENT_CREATE_SUCCESS', comment: res }))
.catch(error => store.dispatch({ type: 'COMMENT_CREATE_FAILED', error }))

// Get a comment stream. Now we don't have the concept of assets, this should
// be adapted to retrieve the current asset when the backend supports it
const fetchCommentStream = store => xenia()
.collection('items')
.match({type: 'comment', 'data.status': { $ne: 'Rejected' }, 'data.createdAt': { $exists: true }})
.sort(['data.createdAt', 1])
.skip(0).limit(100)
.exec()
.then(res => store.dispatch({ type: 'COMMENT_STREAM_FETCH_SUCCESS', comments: res.results[0].Docs }))
.catch(error => store.dispatch({ type: 'COMMENT_STREAM_FETCH_FAILED', error }))

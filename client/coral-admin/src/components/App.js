
import React from 'react'
import { Provider } from 'react-redux'
import 'material-design-lite'
import { Router, Route, browserHistory } from 'react-router'
import ModerationQueue from 'containers/ModerationQueue'
import store from 'services/store'
import CommentStream from 'containers/CommentStream'
import EmbedLink from 'components/EmbedLink'
import Configure from 'containers/Configure'

export default class App extends React.Component {
  render (props) {
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route path='admin' component={ModerationQueue} />
          <Route path='admin/embed' component={CommentStream} />
          <Route path='admin/embedlink' component={EmbedLink} />
          <Route path='admin/configure' component={Configure} />
        </Router>
      </Provider>
    )
  }
}

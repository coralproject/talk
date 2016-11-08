
import React from 'react'
import { Provider } from 'react-redux'
import 'material-design-lite'
import { Router, Route, browserHistory } from 'react-router'
import ModerationQueue from 'containers/ModerationQueue'
import store from 'services/store'
import CommentStream from 'containers/CommentStream'
import EmbedLink from 'components/EmbedLink'
import Configure from 'containers/Configure'
import config from 'services/config'

export default class App extends React.Component {
  render (props) {
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route path={config.basePath} component={ModerationQueue} />
          <Route path={`${config.basePath}/embed`} component={CommentStream} />
          <Route path={`${config.basePath}/embedlink`} component={EmbedLink} />
          <Route path={`${config.basePath}/configure`} component={Configure} />
        </Router>
      </Provider>
    )
  }
}

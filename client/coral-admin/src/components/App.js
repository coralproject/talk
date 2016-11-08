
import React from 'react'
import { Provider } from 'react-redux'
import { Layout } from 'react-mdl'
import 'material-design-lite'
import { Router, Route, browserHistory } from 'react-router'
import ModerationQueue from 'containers/ModerationQueue'
import Header from 'components/Header'
import store from 'services/store'
import CommentStream from 'containers/CommentStream'
import EmbedLink from 'components/EmbedLink'
import Configure from 'containers/Configure'
import config from 'services/config'

export default class App extends React.Component {
  render (props) {
    return (
      <Provider store={store}>
        <Layout>
          <Header>
              <Router history={browserHistory}>
                <Route path={config.base} component={ModerationQueue}>
                  <Route path="embed" component={CommentStream} />
                  <Route path="embedlink" component={EmbedLink} />
                  <Route path="configure" component={Configure} />
                </Route>
              </Router>
          </Header>
        </Layout>
      </Provider>
    )
  }
}

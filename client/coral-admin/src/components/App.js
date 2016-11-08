import React from 'react'
import { Provider } from 'react-redux'
import 'material-design-lite'
import { Layout } from 'react-mdl'
import Header from 'components/Header'
import store from 'services/store'

import AppRouter from '../AppRouter'

export default class App extends React.Component {
  render (props) {
    return (
      <Provider store={store}>
        <AppRouter store={store} />
      </Provider>
    )
  }
}

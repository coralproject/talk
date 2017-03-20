import React from 'react';
import { Provider } from 'react-redux';
import 'material-design-lite';
import store from 'services/store';

import AppRouter from '../AppRouter';

export default class App extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <AppRouter store={store} />
      </Provider>
    );
  }
}

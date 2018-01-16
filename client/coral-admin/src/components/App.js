import React from 'react';
import ToastContainer from './ToastContainer';
import 'material-design-lite';

import AppRouter from '../AppRouter';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <ToastContainer />
        <AppRouter />
      </div>
    );
  }
}

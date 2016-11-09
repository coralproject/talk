import React from 'react';
import {render} from 'react-dom';
import CommentStream from './CommentStream';
import {Provider} from 'react-redux';
import {fetchConfig, store} from '../../coral-framework';

store.dispatch(fetchConfig());

render(
    <Provider store={store}>
      <CommentStream />
    </Provider>
    , document.querySelector('#coralStream'));

import React from 'react';
import {render} from 'react-dom';
import CommentStream from './CommentStream';
import {Provider} from 'react-redux';
import {store} from '../../coral-framework';

render(
    <Provider store={store}>
      <CommentStream />
    </Provider>
    , document.querySelector('#coralStream'));

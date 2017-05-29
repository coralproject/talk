import {createNetworkInterface} from 'apollo-client';
import * as Storage from '../helpers/storage';
import bowser from 'bowser';

//==============================================================================
// NETWORK INTERFACE
//==============================================================================

const networkInterface = createNetworkInterface({
  uri: '/api/v1/graph/ql',
  opts: {
    credentials: 'same-origin'
  }
});

//==============================================================================
// MIDDLEWARES
//==============================================================================

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }

    if (!bowser.safari && !bowser.ios) {
      req.options.headers['authorization'] = `Bearer ${Storage.getItem('token')}`;
    }

    next();
  }
}]);

export {
  networkInterface
};

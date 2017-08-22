import React from 'react';
const PropTypes = require('prop-types');
import {ApolloProvider} from 'react-apollo';

class TalkProvider extends React.Component {
  getChildContext() {
    return {
      eventEmitter: this.props.eventEmitter,
      pym: this.props.pym,
      plugins: this.props.plugins,
    };
  }

  render() {
    const {children, client, store} = this.props;
    return (
      <ApolloProvider client={client} store={store}>
        {children}
      </ApolloProvider>
    );
  }
}

TalkProvider.childContextTypes = {
  pym: PropTypes.object,
  eventEmitter: PropTypes.object,
  plugins: PropTypes.array,
};

export default TalkProvider;

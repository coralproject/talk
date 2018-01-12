import React from 'react';
const PropTypes = require('prop-types');
import { ApolloProvider } from 'react-apollo';

class TalkProvider extends React.Component {
  getChildContext() {
    return {
      eventEmitter: this.props.eventEmitter,
      pym: this.props.pym,
      plugins: this.props.plugins,
      rest: this.props.rest,
      graphql: this.props.graphql,
      notification: this.props.notification,
      storage: this.props.storage,
      history: this.props.history,
      store: this.props.store,
    };
  }

  render() {
    const { children, client } = this.props;
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
  }
}

TalkProvider.childContextTypes = {
  pym: PropTypes.object,
  eventEmitter: PropTypes.object,
  plugins: PropTypes.object,
  rest: PropTypes.func,
  graphql: PropTypes.object,
  notification: PropTypes.object,
  storage: PropTypes.object,
  history: PropTypes.object,
  store: PropTypes.object,
};

export default TalkProvider;

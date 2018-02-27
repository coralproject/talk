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
      localStorage: this.props.localStorage,
      sessionStorage: this.props.sessionStorage,
      history: this.props.history,
      store: this.props.store,
      pymLocalStorage: this.props.pymLocalStorage,
      pymSessionStorage: this.props.pymSessionStorage,
      postMessage: this.props.postMessage,
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
  localStorage: PropTypes.object,
  sessionStorage: PropTypes.object,
  pymLocalStorage: PropTypes.object,
  pymSessionStorage: PropTypes.object,
  history: PropTypes.object,
  store: PropTypes.object,
  postMessage: PropTypes.object,
};

TalkProvider.propTypes = TalkProvider.childContextTypes;

export default TalkProvider;

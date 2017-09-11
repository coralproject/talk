import React from 'react';
import {compose, gql} from 'react-apollo';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import branch from 'recompose/branch';
import renderComponent from 'recompose/renderComponent';

import {Spinner} from 'coral-ui';
import * as authActions from '../actions/auth';
import * as assetActions from '../actions/asset';
import {getDefinitionName, getSlotFragmentSpreads} from 'coral-framework/utils';
import {withQuery} from 'coral-framework/hocs';
import Embed from '../components/Embed';
import Stream from './Stream';
import {notify} from 'coral-framework/actions/notification';
import t from 'coral-framework/services/i18n';
import PropTypes from 'prop-types';
import {setActiveTab} from '../actions/embed';

const {logout, checkLogin, focusSignInDialog, blurSignInDialog, hideSignInDialog} = authActions;
const {fetchAssetSuccess} = assetActions;

class EmbedContainer extends React.Component {
  static contextTypes = {
    pym: PropTypes.object,
  };

  subscriptions = [];

  subscribeToUpdates(props = this.props) {
    if (props.auth.loggedIn) {
      const newSubscriptions = [{
        document: USER_BANNED_SUBSCRIPTION,
        updateQuery: () => {
          notify('info', t('your_account_has_been_banned'));
        },
      },
      {
        document: USER_SUSPENDED_SUBSCRIPTION,
        updateQuery: () => {
          notify('info', t('your_account_has_been_suspended'));
        },
      },
      {
        document: USERNAME_REJECTED_SUBSCRIPTION,
        updateQuery: () => {
          notify('info', t('your_username_has_been_rejected'));
        },
      }];

      this.subscriptions = newSubscriptions.map((s) => props.data.subscribeToMore({
        document: s.document,
        variables: {
          user_id: props.auth.user.id,
        },
        updateQuery: s.updateQuery,
      }));
    }
  }

  unsubscribe() {
    this.subscriptions.forEach((unsubscribe) => unsubscribe());
    this.subscriptions = [];
  }

  resubscribe(props) {
    this.unsubscribe();
    this.subscribeToUpdates(props);
  }

  componentDidMount() {
    this.subscribeToUpdates();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.auth.loggedIn !== nextProps.auth.loggedIn) {

      // Refetch after login/logout.
      this.props.data.refetch();
      this.resubscribe(nextProps);
    }

    const {fetchAssetSuccess} = this.props;
    if (!isEqual(nextProps.root.asset, this.props.root.asset)) {

      // TODO: remove asset data from redux store.
      fetchAssetSuccess(nextProps.root.asset);
    }
  }

  componentDidUpdate(prevProps) {
    if (!get(prevProps, 'root.asset.comment') && get(this.props, 'root.asset.comment')) {

      // Scroll to a permalinked comment if one is in the URL once the page is done rendering.
      setTimeout(() => this.context.pym.scrollParentToChildEl('talk-embed-stream-container'), 0);
    }
  }

  render() {
    if (!this.props.root.asset) {
      return <Spinner />;
    }
    return <Embed {...this.props} />;
  }
}

const USER_BANNED_SUBSCRIPTION = gql`
  subscription UserBanned($user_id: ID!) {
    userBanned(user_id: $user_id){
      id
      status
      canEditName
      suspension {
        until
      }
    }
  }
`;

const USER_SUSPENDED_SUBSCRIPTION = gql`
  subscription UserSuspended($user_id: ID!) {
    userSuspended(user_id: $user_id){
      id
      status
      canEditName
      suspension {
        until
      }
    }
  }
`;

const USERNAME_REJECTED_SUBSCRIPTION = gql`
  subscription UsernameRejected($user_id: ID!) {
    usernameRejected(user_id: $user_id){
      id
      status
      canEditName
      suspension {
        until
      }
    }
  }
`;

const slots = [
  'embed',
];

const EMBED_QUERY = gql`
  query CoralEmbedStream_Embed(
    $assetId: ID,
    $assetUrl: String,
    $commentId: ID!,
    $hasComment: Boolean!,
    $excludeIgnored: Boolean,
    $sortBy: SORT_COMMENTS_BY!,
    $sortOrder: SORT_ORDER!,
  ) {
    me {
      id
      status
    }
    ${getSlotFragmentSpreads(slots, 'root')}
    ...${getDefinitionName(Stream.fragments.root)}
  }
  ${Stream.fragments.root}
`;

export const withEmbedQuery = withQuery(EMBED_QUERY, {
  options: ({auth, commentId, assetId, assetUrl, sortBy, sortOrder}) => ({
    variables: {
      assetId,
      assetUrl,
      commentId,
      hasComment: commentId !== '',
      excludeIgnored: Boolean(auth && auth.user && auth.user.id),
      sortBy,
      sortOrder,
    },
  }),
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  commentId: state.stream.commentId,
  assetId: state.stream.assetId,
  assetUrl: state.stream.assetUrl,
  activeTab: state.embed.activeTab,
  config: state.config,
  sortOrder: state.stream.sortOrder,
  sortBy: state.stream.sortBy,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      logout,
      checkLogin,
      setActiveTab,
      fetchAssetSuccess,
      notify,
      focusSignInDialog,
      blurSignInDialog,
      hideSignInDialog,
    },
    dispatch
  );

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  branch((props) => !props.auth.checkedInitialLogin, renderComponent(Spinner)),
  withEmbedQuery,
)(EmbedContainer);

import React from 'react';
import {compose, gql} from 'react-apollo';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import isEqual from 'lodash/isEqual';
import branch from 'recompose/branch';
import renderComponent from 'recompose/renderComponent';

import {Spinner} from 'coral-ui';
import {authActions, assetActions, pym} from 'coral-framework';
import {getDefinitionName} from 'coral-framework/utils';
import {withQuery} from 'coral-framework/hocs';
import Embed from '../components/Embed';
import Stream from './Stream';

import {setActiveTab} from '../actions/embed';
import {viewAllComments} from '../actions/stream';

const {logout, checkLogin} = authActions;
const {fetchAssetSuccess} = assetActions;

class EmbedContainer extends React.Component {

  componentWillReceiveProps(nextProps) {
    if (this.props.auth.loggedIn !== nextProps.auth.loggedIn) {

      // Refetch after login/logout.
      this.props.data.refetch();
    }

    const {fetchAssetSuccess} = this.props;
    if (!isEqual(nextProps.root.asset, this.props.root.asset)) {

      // TODO: remove asset data from redux store.
      fetchAssetSuccess(nextProps.root.asset);
    }
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.root.comment, this.props.root.comment)) {

      // Scroll to a permalinked comment if one is in the URL once the page is done rendering.
      setTimeout(() => pym.scrollParentToChildEl('coralStream'), 0);
    }
  }

  render() {
    if (!this.props.root.asset) {
      return <Spinner />;
    }
    return <Embed {...this.props} />;
  }
}

const EMBED_QUERY = gql`
  query CoralEmbedStream_Embed($assetId: ID, $assetUrl: String, $commentId: ID!, $hasComment: Boolean!, $excludeIgnored: Boolean) {
    asset(id: $assetId, url: $assetUrl) {
      totalCommentCount(excludeIgnored: $excludeIgnored)
    }
    me {
      id
      status
    }
    ...${getDefinitionName(Stream.fragments.root)}
  }
  ${Stream.fragments.root}
`;

export const withEmbedQuery = withQuery(EMBED_QUERY, {
  options: ({auth, commentId, assetId, assetUrl}) => ({
    variables: {
      assetId,
      assetUrl,
      commentId,
      hasComment: commentId !== '',
      excludeIgnored: Boolean(auth && auth.user && auth.user.id),
    },
  }),
});

const mapStateToProps = (state) => ({
  auth: state.auth.toJS(),
  commentId: state.stream.commentId,
  assetId: state.stream.assetId,
  assetUrl: state.stream.assetUrl,
  activeTab: state.embed.activeTab,
  config: state.config
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      logout,
      checkLogin,
      setActiveTab,
      viewAllComments,
      fetchAssetSuccess,
    },
    dispatch
  );

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  branch((props) => !props.auth.checkedInitialLogin && props.config, renderComponent(Spinner)),
  withEmbedQuery,
)(EmbedContainer);

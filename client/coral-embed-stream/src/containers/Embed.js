import React from 'react';
import {compose, gql, graphql} from 'react-apollo';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import isEqual from 'lodash/isEqual';
import branch from 'recompose/branch';
import renderComponent from 'recompose/renderComponent';
import update from 'immutability-helper';

import {Spinner} from 'coral-ui';
import {authActions, assetActions, pym} from 'coral-framework';
import {getDefinitionName, separateDataAndRoot} from 'coral-framework/utils';
import Embed from '../components/Embed';
import {setCommentCountCache, viewAllComments} from '../actions/stream';
import {setActiveTab} from '../actions/embed';
import Stream from './Stream';

const {logout, checkLogin} = authActions;
const {fetchAssetSuccess} = assetActions;

class EmbedContainer extends React.Component {

  componentDidMount() {
    pym.sendMessage('childReady');
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.root.me && !nextProps.root.me) {

      // Refetch because on logout `excludeIgnored` becomes `false`.
      // TODO: logout via mutation and obsolete this?
      this.props.data.refetch();
    }

    const {fetchAssetSuccess} = this.props;
    if(!isEqual(nextProps.root.asset, this.props.root.asset)) {

      // TODO: remove asset data from redux store.
      fetchAssetSuccess(nextProps.root.asset);

      const {setCommentCountCache, commentCountCache} = this.props;
      const {asset} = nextProps.root;

      if (commentCountCache === -1) {
        setCommentCountCache(asset.commentCount);
      }
    }
  }

  componentDidUpdate(prevProps) {
    if(!isEqual(prevProps.root.comment, this.props.root.comment)) {

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
  query EmbedQuery($assetId: ID, $assetUrl: String, $commentId: ID!, $hasComment: Boolean!, $excludeIgnored: Boolean) {
    asset(id: $assetId, url: $assetUrl) {
      totalCommentCount(excludeIgnored: $excludeIgnored)
    }
    me {
      status
    }
    ...${getDefinitionName(Stream.fragments.root)}
  }
  ${Stream.fragments.root}
`;

export const withQuery = graphql(EMBED_QUERY, {
  options: ({auth, commentId, assetId, assetUrl}) => ({
    variables: {
      assetId,
      assetUrl,
      commentId,
      hasComment: commentId !== '',
      excludeIgnored: Boolean(auth && auth.user && auth.user.id),
    },
    reducer: (previousResult, action, variables) => {
      return reduceEditCommentActionsToUpdateStreamQuery(previousResult, action, variables);
    },
  }),
  props: ({data}) => separateDataAndRoot(data),
});

const mapStateToProps = state => ({
  auth: state.auth.toJS(),
  commentCountCache: state.stream.commentCountCache,
  commentId: state.stream.commentId,
  assetId: state.stream.assetId,
  assetUrl: state.stream.assetUrl,
  activeTab: state.embed.activeTab,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    fetchAssetSuccess,
    checkLogin,
    setCommentCountCache,
    viewAllComments,
    logout,
    setActiveTab,
  }, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  branch(
    props => !props.auth.checkedInitialLogin,
    renderComponent(Spinner),
  ),
  withQuery,
)(EmbedContainer);

/**
 * Reduce editComment mutation actions
 * producing a new queryStream result where asset.comments reflects the edit
 */
function reduceEditCommentActionsToUpdateStreamQuery(previousResult, action) {
  if ( ! (action.type === 'APOLLO_MUTATION_RESULT' && action.operationName === 'editComment')) {
    return previousResult;
  }
  const resultHasErrors = (result) => {
    try {
      return result.data.editComment.errors.length > 0;
    } catch (error) {

      // expected if no errors;
      return false;
    }
  };
  if (resultHasErrors(action.result)) {
    return previousResult;
  }
  const {variables: {id, edit}, result: {data: {editComment: {comment: {status}}}}} = action;
  const updateCommentWithEdit = (comment, edit) => {
    const {body} = edit;
    const editedComment = update(comment, {
      $merge: {
        body
      },
      editing: {$merge:{edited:true}}
    });
    return editedComment;
  };
  const commentIsStillVisible = (comment) => {
    return ! ((id === comment.id) && (['PREMOD', 'REJECTED'].includes(status)));
  };
  const resultReflectingEdit = update(previousResult, {
    asset: {
      comments: {
        $apply: comments => {
          return comments.filter(commentIsStillVisible).map(comment => {
            let replyWasEditedToBeHidden = false;
            if (comment.id === id) {
              return updateCommentWithEdit(comment, edit);
            }
            const commentWithUpdatedReplies = update(comment, {
              replies: {
                $apply: (comments) => {
                  return comments
                    .filter(c => {
                      if (commentIsStillVisible(c)) {
                        return true;
                      }
                      replyWasEditedToBeHidden = true;
                      return false;
                    })
                    .map(comment => {
                      if (comment.id === id) {
                        return updateCommentWithEdit(comment, edit);                          
                      }
                      return comment;
                    });
                }
              },
            });

            // If a reply was edited to be hdiden, then this parent needs its replyCount to be decremented.
            if (replyWasEditedToBeHidden) {
              return update(commentWithUpdatedReplies, {
                replyCount: {
                  $apply: (replyCount) => {
                    return replyCount - 1;
                  }
                }
              });
            }
            return commentWithUpdatedReplies;
          });
        }
      }
    }
  });
  return resultReflectingEdit;
}


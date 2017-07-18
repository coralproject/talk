import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose, gql} from 'react-apollo';
import {getDisplayName} from 'coral-framework/helpers/hoc';
import {capitalize} from 'coral-framework/helpers/strings';
import withMutation from 'coral-framework/hocs/withMutation';
import withFragments from 'coral-framework/hocs/withFragments';
import {showSignInDialog} from 'coral-framework/actions/auth';
import {addNotification} from 'coral-framework/actions/notification';
import {forEachError} from 'coral-framework/utils';

export default (tag) => (WrappedComponent) => {
  if (typeof tag !== 'string') {
    console.error('Tag must be a valid string');
    return null;
  }

  tag = tag.toLowerCase();
  const Tag = capitalize(tag);

  const COMMENT_FRAGMENT = gql`
    fragment Coral_UpdateFragment on Comment {
      tags {
        tag {
          name
        }
      }
    }
  `;

  const isTagged = (tags) =>
  !!tags.filter((t) => t.tag.name === Tag.toUpperCase()).length;

  const withAddTag = withMutation(
    gql`
      mutation AddTag($id: ID!, $asset_id: ID!, $name: String!) {
        addTag(tag: {name: $name, id: $id, item_type: COMMENTS, asset_id: $asset_id}) {
          ...ModifyTagResponse
        }
      }
    `, {
      props: ({mutate}) => ({
        addTag: ({id, name, assetId}) => {
          return mutate({
            variables: {
              id,
              name,
              asset_id: assetId
            },
            optimisticResponse: {
              addTag: {
                __typename: 'ModifyTagResponse',
                errors: null,
              }
            },
            update: (proxy) => {
              const fragmentId = `Comment_${id}`;

              // Read the data from our cache for this query.
              const data = proxy.readFragment({fragment: COMMENT_FRAGMENT, id: fragmentId});

              data.tags.push({
                tag: {
                  __typename: 'Tag',
                  name: Tag.toUpperCase()
                },
                __typename: 'TagLink'
              });

              // Write our data back to the cache.
              proxy.writeFragment({fragment: COMMENT_FRAGMENT, id: fragmentId, data});
            },
          });
        }}),
    });

  const withRemoveTag = withMutation(
    gql`
      mutation RemoveTag($id: ID!, $asset_id: ID!, $name: String!) {
        removeTag(tag: {name: $name, id: $id, item_type: COMMENTS, asset_id: $asset_id}) {
          ...ModifyTagResponse
        }
      }
    `, {
      props: ({mutate}) => ({
        removeTag: ({id, name, assetId}) => {
          return mutate({
            variables: {
              id,
              name,
              asset_id: assetId
            },
            optimisticResponse: {
              removeTag: {
                __typename: 'ModifyTagResponse',
                errors: null,
              }
            },
            update: (proxy) => {
              const fragmentId = `Comment_${id}`;

              // Read the data from our cache for this query.
              const data = proxy.readFragment({fragment: COMMENT_FRAGMENT, id: fragmentId});

              const idx = data.tags.findIndex((i) => i.tag.name === Tag.toUpperCase());

              data.tags = [...data.tags.slice(0, idx), ...data.tags.slice(idx + 1)];

              // Write our data back to the cache.
              proxy.writeFragment({fragment: COMMENT_FRAGMENT, id: fragmentId, data});
            }
          });
        }}),
    });

  class WithTags extends React.Component {
    loading = false;

    postTag = () => {
      const {comment, asset, addNotification} = this.props;

      if (this.loading) {
        return;
      }

      this.loading = true;

      this.props.addTag({
        id: comment.id,
        name: Tag.toUpperCase(),
        assetId: asset.id
      })
      .then(() => {
        this.loading = false;
      })
      .catch((err) => {
        this.loading = false;
        forEachError(err, ({msg}) => addNotification('error', msg));
      });
    }

    deleteTag = () => {
      const {comment, asset, addNotification} = this.props;

      if (this.loading) {
        return;
      }

      this.props.removeTag({
        id: comment.id,
        name: Tag.toUpperCase(),
        assetId: asset.id
      })
      .then(() => {
        this.loading = false;
      })
      .catch((err) => {
        this.loading = false;
        forEachError(err, ({msg}) => addNotification('error', msg));
      });
    }

    render() {
      const {comment} = this.props;

      const alreadyTagged = isTagged(comment.tags);

      return <WrappedComponent
        user={this.props.user}
        comment={comment}
        alreadyTagged={alreadyTagged}
        postTag={this.postTag}
        deleteTag={this.deleteTag}
      />;
    }
  }

  const mapStateToProps = (state) => ({
    user: state.auth.toJS().user,
  });

  const mapDispatchToProps = (dispatch) =>
    bindActionCreators({showSignInDialog, addNotification}, dispatch);

  const enhance = compose(
    withFragments({
      comment: gql`
        fragment ${Tag}Button_comment on Comment {
          tags {
            tag {
              name
            }
          }
        }`
    }),
    connect(mapStateToProps, mapDispatchToProps),
    withAddTag,
    withRemoveTag
  );

  WithTags.displayName = `WithTags(${getDisplayName(WrappedComponent)})`;

  return enhance(WithTags);
};

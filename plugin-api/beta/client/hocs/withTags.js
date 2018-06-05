import React from 'react';
import { connect } from 'react-redux';
import { compose, gql } from 'react-apollo';
import { getDisplayName } from 'coral-framework/helpers/hoc';
import { capitalize } from 'coral-framework/helpers/strings';
import { withAddTag, withRemoveTag } from 'coral-framework/graphql/mutations';
import withFragments from 'coral-framework/hocs/withFragments';
import { isTagged } from 'coral-framework/utils';
import hoistStatics from 'recompose/hoistStatics';
import { getDefinitionName } from '../utils';

/*
 * Disable false-positive warning below, as it doesn't work well with how we currently
 * assemble the queries.
 *
 * Warning: fragment with name {fragment name} already exists.
 * graphql-tag enforces all fragment names across your application to be unique; read more about
 * this in the docs: http://dev.apollodata.com/core/fragments.html#unique-names
 */
gql.disableFragmentWarnings();

export default (tag, options = {}) =>
  hoistStatics(WrappedComponent => {
    if (typeof tag !== 'string') {
      console.error('Tag must be a valid string');
      return null;
    }

    // fragments allow the extension of the fragments defined in this HOC.
    const { fragments = {} } = options;

    const Tag = capitalize(tag);
    const TAG = tag.toUpperCase();

    class WithTags extends React.Component {
      loading = false;

      postTag = () => {
        const { comment, asset } = this.props;

        if (this.loading) {
          return;
        }

        this.loading = true;

        return this.props
          .addTag({
            id: comment.id,
            name: TAG,
            assetId: asset.id,
            itemType: 'COMMENTS',
          })
          .then(result => {
            this.loading = false;
            return result;
          })
          .catch(err => {
            this.loading = false;
            throw err;
          });
      };

      deleteTag = () => {
        const { comment, asset } = this.props;

        if (this.loading) {
          return;
        }

        this.props
          .removeTag({
            id: comment.id,
            name: TAG,
            assetId: asset.id,
            itemType: 'COMMENTS',
          })
          .then(result => {
            this.loading = false;
            return result;
          })
          .catch(err => {
            this.loading = false;
            throw err;
          });
      };

      render() {
        const { root, asset, comment, user, config, ...rest } = this.props;

        const alreadyTagged = isTagged(comment.tags, TAG);

        return (
          <WrappedComponent
            {...rest}
            root={root}
            asset={asset}
            comment={comment}
            user={user}
            alreadyTagged={alreadyTagged}
            postTag={this.postTag}
            deleteTag={this.deleteTag}
            config={config}
          />
        );
      }
    }

    const mapStateToProps = state => ({
      user: state.auth.user,
    });

    const enhance = compose(
      withFragments({
        ...fragments,
        asset: gql`
        fragment ${Tag}Button_asset on Asset {
          id
          ${fragments.asset ? `...${getDefinitionName(fragments.asset)}` : ''}
        }
        ${fragments.asset ? fragments.asset : ''}
      `,
        comment: gql`
        fragment ${Tag}Button_comment on Comment {
          id
          tags {
            tag {
              name
            }
          }
          ${
            fragments.comment
              ? `...${getDefinitionName(fragments.comment)}`
              : ''
          }
        }
        ${fragments.comment ? fragments.comment : ''}
      `,
      }),
      withAddTag,
      withRemoveTag,
      connect(
        mapStateToProps,
        null
      )
    );

    WithTags.displayName = `WithTags(${getDisplayName(WrappedComponent)})`;

    return enhance(WithTags);
  });

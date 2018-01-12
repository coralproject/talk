import React from 'react';
import PropTypes from 'prop-types';
import { gql, compose } from 'react-apollo';
import { withFragments } from 'coral-framework/hocs';

const FRAGMENT = gql`
  fragment CoralEmbedStream_AutomaticAssetClosure_Fragment on Asset {
    isClosed
  }
`;

function getFragmentId(assetId) {
  return `Asset_${assetId}`;
}

/**
 * AutomaticAssetClosure updates the graphql state of the provide asset
 * to `isClosed=true` when passed `closedAt`.
 */

class AutomaticAssetClosure extends React.Component {
  static contextTypes = {
    client: PropTypes.object.isRequired,
  };

  timer = null;

  componentWillMount() {
    this.setupTimer(this.props.asset.id, this.props.asset.closedAt);
  }

  componentWillReceiveProps(next) {
    if (
      this.props.asset.id !== next.asset.id ||
      this.props.asset.closedAt !== next.asset.closedAt
    ) {
      this.setupTimer(next.asset.id, next.asset.closedAt);
    }
  }

  closeAsset(assetId) {
    this.context.client.writeFragment({
      fragment: FRAGMENT,
      id: getFragmentId(assetId),
      data: {
        __typename: 'Asset',
        isClosed: true,
      },
    });
  }

  setupTimer(assetId, closedAt) {
    clearTimeout(this.timer);
    this.timer = null;

    if (assetId && closedAt) {
      const asset = this.context.client.readFragment({
        fragment: FRAGMENT,
        id: getFragmentId(assetId),
      });

      if (!asset.isClosed && closedAt) {
        const diff = new Date(closedAt) - new Date();
        if (diff >= 0) {
          this.timer = setTimeout(() => this.closeAsset(assetId), diff);
        } else {
          this.closeAsset(assetId);
        }
      }
    }
  }

  render() {
    return null;
  }
}

AutomaticAssetClosure.propTypes = {
  asset: PropTypes.object.isRequired,
};

const withAutomaticAssetClosureFragments = withFragments({
  asset: gql`
    fragment CoralEmbedStream_AutomaticAssetClosure_asset on Asset {
      id
      closedAt
    }
  `,
});

const enhance = compose(withAutomaticAssetClosureFragments);

export default enhance(AutomaticAssetClosure);

import React from 'react';
import PropTypes from 'prop-types';
import {gql} from 'react-apollo';

const FRAGMENT = gql`
  fragment CoralEmbedStream_AutomaticAssetClosure_Fragment on Asset {
    id
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
    this.setupTimer(this.props.assetId, this.props.closedAt);
  }

  componentWillReceiveProps(next) {
    if (
      this.props.assetId !== next.assetId ||
      this.props.closedAt !== next.closedAt
    ) {
      this.setupTimer(next.assetId, next.closedAt);
    }
  }

  closeAsset(assetId) {
    this.context.client.writeFragment({
      fragment: FRAGMENT,
      id: getFragmentId(assetId),
      data: {
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
        const diff = (new Date(closedAt) - new Date());
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

AutomaticAssetClosure.PropTypes = {
  assetId: PropTypes.string,
  closedAt: PropTypes.string,
};

export default AutomaticAssetClosure;

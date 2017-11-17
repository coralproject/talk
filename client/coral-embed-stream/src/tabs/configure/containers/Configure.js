import React from 'react';
import {gql, compose} from 'react-apollo';
import {withFragments} from 'coral-framework/hocs';
import Configure from '../components/Configure';
import PropTypes from 'prop-types';
import {withUpdateAssetStatus} from 'coral-framework/graphql/mutations';

class ConfigureContainer extends React.Component {

  openAsset = () => this.props.updateAssetStatus(this.props.asset.id, {closedAt: null});
  closeAsset = () => this.props.updateAssetStatus(this.props.asset.id, {closedAt: new Date().toISOString()});

  render() {
    return <Configure
      settings={this.props.asset.settings}
      isClosed={this.props.asset.isClosed}
      closedAt={this.props.asset.closedAt}
      onOpenAsset={this.openAsset}
      onCloseAsset={this.closeAsset}
    />;
  }
}

ConfigureContainer.propTypes = {
  asset: PropTypes.object.isRequired,
  updateAssetStatus: PropTypes.func.isRequired,
};

const withConfigureFragments = withFragments({
  root: gql`
    fragment CoralEmbedStream_Configure_root on RootQuery {
      __typename
    }
  `,
  asset: gql`
    fragment CoralEmbedStream_Configure_asset on Asset {
      id
      closedAt
      isClosed
      settings {
        moderation
      }
    }
  `,
});

const enhance = compose(
  withConfigureFragments,
  withUpdateAssetStatus,
);

export default enhance(ConfigureContainer);

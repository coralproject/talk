import React from 'react';
import { gql, compose } from 'react-apollo';
import { withFragments } from 'coral-framework/hocs';
import Configure from '../components/Configure';
import AssetStatusInfo from './AssetStatusInfo';
import Settings from './Settings';
import PropTypes from 'prop-types';
import { getDefinitionName } from 'coral-framework/utils';

class ConfigureContainer extends React.Component {
  render() {
    return (
      <Configure
        data={this.props.data}
        root={this.props.root}
        asset={this.props.asset}
      />
    );
  }
}

ConfigureContainer.propTypes = {
  data: PropTypes.object.isRequired,
  root: PropTypes.object.isRequired,
  asset: PropTypes.object.isRequired,
};

const withConfigureFragments = withFragments({
  root: gql`
    fragment CoralEmbedStream_Configure_root on RootQuery {
      __typename
      ...${getDefinitionName(Settings.fragments.root)}
    }
    ${Settings.fragments.root}
  `,
  asset: gql`
    fragment CoralEmbedStream_Configure_asset on Asset {
      __typename
      ...${getDefinitionName(AssetStatusInfo.fragments.asset)}
      ...${getDefinitionName(Settings.fragments.asset)}
    }
    ${AssetStatusInfo.fragments.asset}
    ${Settings.fragments.asset}
  `,
});

const enhance = compose(withConfigureFragments);

export default enhance(ConfigureContainer);

import React from 'react';
import {gql, compose} from 'react-apollo';
import {withFragments} from 'coral-framework/hocs';
import Configure from '../components/Configure';
import PropTypes from 'prop-types';

class ConfigureContainer extends React.Component {
  render() {
    return <Configure
      settings={this.props.asset.settings}
      isClosed={this.props.asset.isClosed}
      closedAt={this.props.asset.closedAt}
    />;
  }
}

ConfigureContainer.propTypes = {
  asset: PropTypes.object,
};

const withConfigureFragments = withFragments({
  root: gql`
    fragment CoralEmbedStream_Configure_root on RootQuery {
      __typename
    }
  `,
  asset: gql`
    fragment CoralEmbedStream_Configure_asset on Asset {
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
);

export default enhance(ConfigureContainer);

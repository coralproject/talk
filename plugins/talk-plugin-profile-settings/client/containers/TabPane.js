import React from 'react';
import { compose, gql } from 'react-apollo';
import TabPane from '../components/TabPane';
import { withFragments } from 'plugin-api/beta/client/hocs';
import { getSlotFragmentSpreads } from 'plugin-api/beta/client/utils';

const slots = ['profileSettings'];

class TabPaneContainer extends React.Component {
  render() {
    return <TabPane {...this.props} />;
  }
}

const enhance = compose(
  withFragments({
    root: gql`
      fragment TalkProfileSettings_TabPane_root on RootQuery {
        __typename
        ${getSlotFragmentSpreads(slots, 'root')}
      }
    `,
  })
);

export default enhance(TabPaneContainer);

import React from 'react';
import { compose, gql } from 'react-apollo';
import Settings from '../components/Settings';
import { withFragments } from 'coral-framework/hocs';
import { getSlotFragmentSpreads } from 'coral-framework/utils';
import { getDefinitionName } from 'coral-framework/utils';
import DownloadCommentHistorySection from '../components/DownloadCommentHistorySection';

const slots = ['profileSettings'];

class SettingsContainer extends React.Component {
  render() {
    return <Settings {...this.props} />;
  }
}

const enhance = compose(
  withFragments({
    root: gql`
      fragment TalkEmbedStream_ProfileSettings_root on RootQuery {
        __typename
        ${getSlotFragmentSpreads(slots, 'root')}
        ...${getDefinitionName(DownloadCommentHistorySection.fragments.root)}
      }
      ${DownloadCommentHistorySection.fragments.root}
    `,
  })
);

export default enhance(SettingsContainer);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, gql } from 'react-apollo';
import { bindActionCreators } from 'redux';
import { withSlotElements, withFragments } from 'coral-framework/hocs';
import Settings from './Settings';
import CommentHistory from './CommentHistory';
import { getDefinitionName } from 'coral-framework/utils';
import TabPanel from '../components/TabPanel';
import { setActiveTab } from '../../../actions/profile';
import { getSlotFragmentSpreads } from 'coral-framework/utils';

class TabPanelContainer extends Component {
  render() {
    return (
      <TabPanel
        root={this.props.root}
        slotPassthrough={this.props.slotPassthrough}
        activeTab={this.props.activeTab}
        setActiveTab={this.props.setActiveTab}
        showSettingsTab={this.props.profileSettingsSlotElements.length > 0}
      />
    );
  }
}

TabPanelContainer.propTypes = {
  root: PropTypes.object,
  slotPassthrough: PropTypes.object,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  profileSettingsSlotElements: PropTypes.array.isRequired,
};

const slots = ['profileTabs', 'profileTabsPrepend', 'profileTabPanes'];

const mapStateToProps = state => ({
  activeTab: state.profile.activeTab,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setActiveTab }, dispatch);

export default compose(
  withFragments({
    root: gql`
      fragment TalkEmbedStream_ProfileTabPanel_root on RootQuery {
    __typename
    ...${getDefinitionName(CommentHistory.fragments.root)}
    ...${getDefinitionName(Settings.fragments.root)}
    ${getSlotFragmentSpreads(slots, 'root')}
  }
  ${CommentHistory.fragments.root}
  ${Settings.fragments.root}
`,
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withSlotElements({
    slot: 'profileSettings',
    propName: 'profileSettingsSlotElements',
    passthroughPropName: 'slotPassthrough',
  })
)(TabPanelContainer);

import React from 'react';
import StreamTabPanel from '../components/StreamTabPanel';
import {connect} from 'react-redux';
import omit from 'lodash/omit';
import {getSlotComponents} from 'coral-framework/helpers/plugins';
import {Tab, TabPane} from 'coral-ui';
import {getShallowChanges} from 'coral-framework/utils';
import isEqual from 'lodash/isEqual';

class StreamTabPanelContainer extends React.Component {

  componentDidMount() {
    this.fallbackAllTab();
  }

  componentWillReceiveProps(next) {
    this.fallbackAllTab(next);
  }

  shouldComponentUpdate(next) {

    // Prevent Slot from rerendering when only reduxState has changed and
    // it does not result in a change of slot children.
    const changes = getShallowChanges(this.props, next);
    if (changes.length === 1 && changes[0] === 'reduxState') {
      const prevUuid = this.getSlotComponents(this.props.tabSlot, this.props).map((cmp) => cmp.talkUuid);
      const nextUuid = this.getSlotComponents(next.tabSlot, next).map((cmp) => cmp.talkUuid);
      return !isEqual(prevUuid, nextUuid);
    }

    // Prevent Slot from rerendering when no props has shallowly changed.
    return changes.length !== 0;
  }

  fallbackAllTab(props = this.props) {
    if (props.activeTab !== props.fallbackTab) {
      const slotPlugins = this.getSlotComponents(props.tabSlot, props).map((c) => c.talkPluginName);
      if (slotPlugins.indexOf(props.activeTab) === -1) {
        props.setActiveTab(props.fallbackTab);
      }
    }
  }

  getSlotComponents(slot, props = this.props) {
    return getSlotComponents(slot, props.reduxState, props.slotProps);
  }

  getPluginTabElements(props = this.props) {
    return this.getSlotComponents(props.tabSlot).map((PluginComponent) => (
      <Tab tabId={PluginComponent.talkPluginName} key={PluginComponent.talkPluginName}>
        <PluginComponent
          {...props.slotProps}
          active={this.props.activeTab === PluginComponent.talkPluginName}
        />
      </Tab>
    ));
  }

  getPluginTabPaneElements(props = this.props) {
    return this.getSlotComponents(props.tabPaneSlot).map((PluginComponent) => (
      <TabPane tabId={PluginComponent.talkPluginName} key={PluginComponent.talkPluginName}>
        <PluginComponent
          {...props.slotProps}
        />
      </TabPane>
    ));
  }

  render() {
    return (
      <StreamTabPanel
        {...this.props}
        pluginTabElements={this.getPluginTabElements()}
        pluginTabPaneElements={this.getPluginTabPaneElements()}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  reduxState: omit(state, 'apollo'),
});

export default connect(mapStateToProps, null)(StreamTabPanelContainer);

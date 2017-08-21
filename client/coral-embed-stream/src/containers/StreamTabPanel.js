import React from 'react';
import StreamTabPanel from '../components/StreamTabPanel';
import {connect} from 'react-redux';
import omit from 'lodash/omit';
import {getSlotComponents, getSlotComponentProps} from 'coral-framework/helpers/plugins';
import {Tab, TabPane} from 'coral-ui';
import {getShallowChanges} from 'coral-framework/utils';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';

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
    return getSlotComponents(slot, props.reduxState, props.slotProps, props.queryData);
  }

  getPluginTabElements(props = this.props) {
    return this.getSlotComponents(props.tabSlot).map((PluginComponent) => (
      <Tab tabId={PluginComponent.talkPluginName} key={PluginComponent.talkPluginName}>
        <PluginComponent
          {...getSlotComponentProps(PluginComponent, props.reduxState, props.slotProps, props.queryData)}
          active={this.props.activeTab === PluginComponent.talkPluginName}
        />
      </Tab>
    ));
  }

  getPluginTabPaneElements(props = this.props) {
    return this.getSlotComponents(props.tabPaneSlot).map((PluginComponent) => (
      <TabPane tabId={PluginComponent.talkPluginName} key={PluginComponent.talkPluginName}>
        <PluginComponent
          {...getSlotComponentProps(PluginComponent, props.reduxState, props.slotProps, props.queryData)}
        />
      </TabPane>
    ));
  }

  render() {
    return (
      <StreamTabPanel
        className={this.props.className}
        activeTab={this.props.activeTab}
        setActiveTab={this.props.setActiveTab}
        tabs={this.getPluginTabElements().concat(this.props.appendTabs)}
        tabPanes={this.getPluginTabPaneElements().concat(this.props.appendTabPanes)}
        sub={this.props.sub}
      />
    );
  }
}

StreamTabPanelContainer.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  appendTabs: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ]),
  appendTabPanes: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ]),
  fallbackTab: PropTypes.string.isRequired,
  tabSlot: PropTypes.string.isRequired,
  tabPaneSlot: PropTypes.string.isRequired,
  slotProps: PropTypes.object.isRequired,
  queryData: PropTypes.object,
  className: PropTypes.string,
  sub: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  reduxState: omit(state, 'apollo'),
});

export default connect(mapStateToProps, null)(StreamTabPanelContainer);

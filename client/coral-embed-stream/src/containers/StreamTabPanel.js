import React from 'react';
import StreamTabPanel from '../components/StreamTabPanel';
import {connect} from 'react-redux';
import omit from 'lodash/omit';
import {Tab, TabPane} from 'coral-ui';
import {getShallowChanges} from 'coral-framework/utils';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';

class StreamTabPanelContainer extends React.Component {
  static contextTypes = {
    plugins: PropTypes.object,
  };

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
      const prevKeys = this.getSlotElements(this.props.tabSlot, this.props).map((el) => el.key);
      const nextKeys = this.getSlotElements(next.tabSlot, next).map((el) => el.key);
      return !isEqual(prevKeys, nextKeys);
    }

    // Prevent Slot from rerendering when no props has shallowly changed.
    return changes.length !== 0;
  }

  fallbackAllTab(props = this.props) {
    if (props.activeTab !== props.fallbackTab) {
      const slotPlugins = this.getSlotElements(props.tabSlot, props).map((el) => el.type.talkPluginName);
      if (slotPlugins.indexOf(props.activeTab) === -1) {
        props.setActiveTab(props.fallbackTab);
      }
    }
  }

  getSlotElements(slot, props = this.props) {
    const {plugins} = this.context;
    return plugins.getSlotElements(slot, props.reduxState, props.slotProps, props.queryData);
  }

  getPluginTabElements(props = this.props) {
    return this.getSlotElements(props.tabSlot).map((el) => {
      return (
        <Tab tabId={el.type.talkPluginName} key={el.type.talkPluginName}>
          {React.cloneElement(el, {active: this.props.activeTab === el.type.talkPluginName})}
        </Tab>
      );
    });
  }

  getPluginTabPaneElements(props = this.props) {
    return this.getSlotElements(props.tabPaneSlot).map((el) => {
      return (
        <TabPane tabId={el.type.talkPluginName} key={el.type.talkPluginName}>
          {el}
        </TabPane>
      );
    });
  }

  render() {
    return (
      <StreamTabPanel
        className={this.props.className}
        activeTab={this.props.activeTab}
        setActiveTab={this.props.setActiveTab}
        tabs={this.getPluginTabElements().concat(this.props.appendTabs)}
        tabPanes={this.getPluginTabPaneElements().concat(this.props.appendTabPanes)}
        loading={this.props.loading}
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
  loading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  reduxState: omit(state, 'apollo'),
});

export default connect(mapStateToProps, null)(StreamTabPanelContainer);

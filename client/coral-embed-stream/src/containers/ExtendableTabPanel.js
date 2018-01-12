import React from 'react';
import ExtendableTabPanel from '../components/ExtendableTabPanel';
import { connect } from 'react-redux';
import { TabPane } from 'coral-ui';
import ExtendableTab from '../components/ExtendableTab';
import { getShallowChanges } from 'coral-framework/utils';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';

class ExtendableTabPanelContainer extends React.Component {
  static contextTypes = {
    plugins: PropTypes.object,
  };

  componentDidMount() {
    this.handleFallback();
  }

  componentWillReceiveProps(next) {
    this.handleFallback(next);
  }

  shouldComponentUpdate(next) {
    // Prevent Slot from rerendering when only reduxState has changed and
    // it does not result in a change of slot children.
    const changes = getShallowChanges(this.props, next);
    if (changes.length === 1 && changes[0] === 'reduxState') {
      const prevKeys = this.getSlotElements(this.props.tabSlot, this.props).map(
        el => el.key
      );
      const nextKeys = this.getSlotElements(next.tabSlot, next).map(
        el => el.key
      );
      return !isEqual(prevKeys, nextKeys);
    }

    // Prevent Slot from rerendering when no props has shallowly changed.
    return changes.length !== 0;
  }

  handleFallback(props = this.props) {
    if (this.getTabNames(props).indexOf(props.activeTab) === -1) {
      props.setActiveTab(props.fallbackTab);
    }
  }

  getTabNames(props = this.props) {
    return this.getTabElements(props).map(el => el.props.tabId);
  }

  getSlotElements(slot, props = this.props) {
    const { plugins } = this.context;
    return plugins.getSlotElements(
      slot,
      props.reduxState,
      props.slotProps,
      props.queryData
    );
  }

  getPluginTabElements(props = this.props) {
    return this.getSlotTabElements(props.tabSlot);
  }

  getPluginTabElementsPrepend(props = this.props) {
    return this.getSlotTabElements(props.tabSlotPrepend);
  }

  getSlotTabElements(slot) {
    return this.getSlotElements(slot).map(el => {
      return (
        <ExtendableTab
          tabId={el.type.talkPluginName}
          key={el.type.talkPluginName}
        >
          {React.cloneElement(el, {
            active: this.props.activeTab === el.type.talkPluginName,
          })}
        </ExtendableTab>
      );
    });
  }

  getTabElements(props = this.props) {
    const elements = [...this.getPluginTabElementsPrepend(props)];
    if (Array.isArray(props.tabs)) {
      elements.push(...props.tabs);
    } else {
      elements.push(props.tabs);
    }
    elements.push(...this.getPluginTabElements(props));
    return elements;
  }

  getPluginTabPaneElements(props = this.props) {
    return this.getSlotElements(props.tabPaneSlot).map(el => {
      return (
        <TabPane tabId={el.type.talkPluginName} key={el.type.talkPluginName}>
          {el}
        </TabPane>
      );
    });
  }

  render() {
    return (
      <ExtendableTabPanel
        className={this.props.className}
        activeTab={this.props.activeTab}
        setActiveTab={this.props.setActiveTab}
        tabs={this.getTabElements()}
        tabPanes={this.getPluginTabPaneElements().concat(this.props.tabPanes)}
        loading={this.props.loading}
        sub={this.props.sub}
      />
    );
  }
}

ExtendableTabPanelContainer.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  tabs: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  tabPanes: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  fallbackTab: PropTypes.string.isRequired,
  tabSlot: PropTypes.string.isRequired,
  tabSlotPrepend: PropTypes.string.isRequired,
  tabPaneSlot: PropTypes.string.isRequired,
  slotProps: PropTypes.object.isRequired,
  queryData: PropTypes.object,
  className: PropTypes.string,
  sub: PropTypes.bool,
  loading: PropTypes.bool,
};

const mapStateToProps = state => ({
  reduxState: state,
});

export default connect(mapStateToProps, null)(ExtendableTabPanelContainer);

import React from 'react';
import ExtendableTabPanel from '../components/ExtendableTabPanel';
import { TabPane } from 'coral-ui';
import ExtendableTab from '../components/ExtendableTab';
import PropTypes from 'prop-types';
import { withSlotElements } from 'coral-framework/hocs';
import { compose } from 'recompose';

class ExtendableTabPanelContainer extends React.Component {
  componentDidMount() {
    this.handleFallback();
  }

  componentWillReceiveProps(next) {
    this.handleFallback(next);
  }

  handleFallback(props = this.props) {
    if (this.getTabNames(props).indexOf(props.activeTab) === -1) {
      props.setActiveTab(props.fallbackTab);
    }
  }

  getTabNames(props = this.props) {
    return this.getTabElements(props).map(el => el.props.tabId);
  }

  getPluginTabElements(props = this.props) {
    return props.slotElements[0].map(this.createPluginTabFactory(props));
  }

  getPluginTabElementsPrepend(props = this.props) {
    return props.slotElements[1].map(this.createPluginTabFactory(props));
  }

  createPluginTabFactory = (props = this.props) => el => {
    return (
      <ExtendableTab tabId={el.key} key={el.key}>
        {React.cloneElement(el, {
          active: props.activeTab === el.key,
        })}
      </ExtendableTab>
    );
  };

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

  createPluginTabPane(el) {
    return (
      <TabPane tabId={el.key} key={el.key}>
        {el}
      </TabPane>
    );
  }

  getPluginTabPaneElements(props = this.props) {
    return props.slotElements[2].map(this.createPluginTabPane);
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
  slotPassthrough: PropTypes.object,
  className: PropTypes.string,
  sub: PropTypes.bool,
  loading: PropTypes.bool,
};

export default compose(
  withSlotElements({
    slot: props => [props.tabSlot, props.tabSlotPrepend, props.tabPaneSlot],
    passthroughPropName: 'slotPassthrough',
  })
)(ExtendableTabPanelContainer);

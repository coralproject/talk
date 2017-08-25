import React from 'react';
import {TabBar, TabContent} from 'coral-ui';
import PropTypes from 'prop-types';

class StreamTabPanel extends React.Component {

  render() {
    const {activeTab, setActiveTab, tabs, tabPanes, sub} = this.props;
    return (
      <div>
        <TabBar activeTab={activeTab} onTabClick={setActiveTab} sub={sub}>
          {tabs}
        </TabBar>
        <TabContent activeTab={activeTab} sub={sub}>
          {tabPanes}
        </TabContent>
      </div>
    );
  }
}

StreamTabPanel.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  tabs: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ]),
  tabPanes: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ]),
  className: PropTypes.string,
  sub: PropTypes.bool,
};

export default StreamTabPanel;

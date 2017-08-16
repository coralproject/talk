import React from 'react';
import {TabBar, TabContent} from 'coral-ui';

class StreamTabPanel extends React.Component {

  render() {
    const {activeTab, setActiveTab, appendTabs, appendTabPanes, pluginTabElements, pluginTabPaneElements, sub} = this.props;
    return (
      <div>
        <TabBar activeTab={activeTab} onTabClick={setActiveTab} sub={sub}>
          {pluginTabElements}
          {appendTabs}
        </TabBar>
        <TabContent activeTab={activeTab} sub={sub}>
          {pluginTabPaneElements}
          {appendTabPanes}
        </TabContent>
      </div>
    );
  }
}

export default StreamTabPanel;

import React from 'react';
import {Spinner, TabBar, TabContent} from 'coral-ui';
import PropTypes from 'prop-types';
import styles from './StreamTabPanel.css';

class StreamTabPanel extends React.Component {

  render() {
    const {activeTab, setActiveTab, tabs, tabPanes, sub, loading} = this.props;
    return (
      <div>
        <TabBar activeTab={activeTab} onTabClick={setActiveTab} sub={sub}>
          {tabs}
        </TabBar>
        {loading
          ? <div className={styles.spinnerContainer}><Spinner /></div>
          : <TabContent activeTab={activeTab} sub={sub}>
            {tabPanes}
          </TabContent>
        }
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

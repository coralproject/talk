import React from 'react';
import { Spinner, TabBar, TabContent } from 'coral-ui';
import PropTypes from 'prop-types';
import styles from './ExtendableTabPanel.css';

class ExtendableTabPanel extends React.Component {
  render() {
    const {
      activeTab,
      setActiveTab,
      tabs,
      tabPanes,
      sub,
      loading,
      ...rest
    } = this.props;
    return (
      <div {...rest}>
        {tabs && (
          <TabBar activeTab={activeTab} onTabClick={setActiveTab} sub={sub}>
            {tabs}
          </TabBar>
        )}
        {loading ? (
          <div className={styles.spinnerContainer}>
            <Spinner />
          </div>
        ) : (
          <TabContent activeTab={activeTab} sub={sub}>
            {tabPanes}
          </TabContent>
        )}
      </div>
    );
  }
}

ExtendableTabPanel.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  tabs: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  tabPanes: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  className: PropTypes.string,
  sub: PropTypes.bool,
};

export default ExtendableTabPanel;

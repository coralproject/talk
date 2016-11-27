import React from 'react';
import styles from './TabBar.css';

export class TabBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickTab = this.handleClickTab.bind(this);
  }

  handleClickTab (e) {
    console.log(e);
  }

  render() {
    const {children, activeTab = 0} = this.props;

    return (
      <div>
        <ul className={styles.base}>
        {React.Children.map(children, (child, tabId) =>
          React.cloneElement(child, {
            tabId,
            active: tabId === activeTab,
            onTabClick: this.handleClickTab,
          })
        )}
        </ul>
      </div>
    );
  }
}

export default TabBar;

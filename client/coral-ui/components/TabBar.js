import React from 'react';
import styles from './TabBar.css';

export class TabBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickTab = this.handleClickTab.bind(this);
  }

  handleClickTab(tabId) {
    if (this.props.onChange) {
      this.props.onChange(tabId);
    }
  }

  render() {
    const {children, activeTab, cStyle = 'base'} = this.props;
    return (
      <div>
        <ul className={`${styles.base} ${cStyle ? styles[cStyle] : ''}`}>
          {React.Children.map(children, (child, tabId) =>
            React.cloneElement(child, {
              tabId,
              active: tabId === activeTab,
              onTabClick: this.handleClickTab,
              cStyle
            })
          )}
        </ul>
      </div>
    );
  }
}

export default TabBar;

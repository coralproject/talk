import React from 'react';
import styles from './TabBar.css';

class TabBar extends React.Component {
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
        <ul className={`${styles.base} ${cStyle ? styles[cStyle] : ''} talk-tab-bar ${this.props.className}`}>
          {React.Children.toArray(children)
            .filter((child) => !child.props.restricted)
            .map((child, tabId) =>
              React.cloneElement(child, {
                tabId,
                active: child.props.id === activeTab,
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

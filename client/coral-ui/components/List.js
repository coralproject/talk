import React, {Component} from 'react';
import styles from './List.css';

export default class List extends Component {
  constructor(props) {
    super(props);
    this.handleClickItem = this.handleClickItem.bind(this);
  }

  handleClickItem(itemId) {
    if (this.props.onChange) {
      this.props.onChange(itemId);
    }
  }

  render() {
    const {children, activeItem, itemId, className = ''} = this.props;
    return (
      <ul className={`${styles.base} ${className}`}>
        {React.Children.toArray(children)
          .filter(child => !child.props.restricted)
          .map((child, i) =>
            React.cloneElement(child, {
              i,
              itemId: child.props.itemId,
              active: itemId === activeItem,
              onItemClick: this.handleClickItem,
            })
          )}
      </ul>
    );
  }
}

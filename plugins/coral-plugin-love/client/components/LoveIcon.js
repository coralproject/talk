import React from 'react';
import styles from './style.css';
import cn from 'classnames';

export default class LoveIcon extends React.Component {

  render() {
    const {me} = this.props.data;
    let love = me && me.roles && me.roles[0] === 'ADMIN';

    return (
      <div className={styles.love}>
        <button
          className={cn(styles.button, {[styles.love]: love})} >
          <i className={cn('love')} aria-hidden="true"/>
        </button>
      </div>
    );
  }
}

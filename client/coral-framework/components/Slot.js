import React from 'react';
import cn from 'classnames';
import styles from './Slot.css';
import {connect} from 'react-redux';
import {getSlotElements} from 'coral-framework/helpers/plugins';
import omit from 'lodash/omit';
import union from 'lodash/union';
import isEqual from 'lodash/isEqual';

class Slot extends React.Component {
  shouldComponentUpdate(next) {

    // Prevent Slot from rerendering when only reduxState has changed and
    // it does not result in a change of slot children.
    const keys = union(Object.keys(this.props), Object.keys(next));
    const changes = keys.filter((key) => this.props[key] !== next[key]);
    if (changes.length === 1 && changes[0] === 'reduxState') {
      const prevChildrenUuid = this.getChildren(this.props).map((child) => child.type.talkUuid);
      const nextChildrenUuid = this.getChildren(next).map((child) => child.type.talkUuid);
      return !isEqual(prevChildrenUuid, nextChildrenUuid);
    }

    // Prevent Slot from rerendering when no props has shallowly changed.
    return changes.length !== 0;
  }

  getSlotProps({fill: _a, inline: _b, className: _c, reduxState: _d, defaultComponent_: _e, ...rest} = this.props) {
    return rest;
  }

  getChildren(props = this.props) {
    return getSlotElements(props.fill, props.reduxState, this.getSlotProps(props));
  }

  render() {
    const {inline = false, className, reduxState, defaultComponent: DefaultComponent} = this.props;
    let children = this.getChildren();
    const pluginConfig = reduxState.config.pluginConfig || {};
    if (children.length === 0 && DefaultComponent) {
      children = <DefaultComponent {...this.getSlotProps(this.props)} />;
    }

    return (
      <div className={cn({[styles.inline]: inline, [styles.debug]: pluginConfig.debug}, className)}>
        {children}
      </div>
    );
  }
}

Slot.propTypes = {
  fill: React.PropTypes.string
};

const mapStateToProps = (state) => ({
  reduxState: omit(state, 'apollo'),
});

export default connect(mapStateToProps, null)(Slot);


import React from 'react';
import cn from 'classnames';
import styles from './Slot.css';
import {connect} from 'react-redux';
import omit from 'lodash/omit';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import {getShallowChanges} from 'coral-framework/utils';

const emptyConfig = {};

class Slot extends React.Component {
  static contextTypes = {
    plugins: PropTypes.object,
  };

  shouldComponentUpdate(next) {

    // Prevent Slot from rerendering when only reduxState has changed and
    // it does not result in a change of slot children.
    const changes = getShallowChanges(this.props, next);
    if (changes.length === 1 && changes[0] === 'reduxState') {
      const prevChildrenUuid = this.getChildren(this.props).map((child) => child.type.talkUuid);
      const nextChildrenUuid = this.getChildren(next).map((child) => child.type.talkUuid);
      return !isEqual(prevChildrenUuid, nextChildrenUuid);
    }

    // Prevent Slot from rerendering when no props has shallowly changed.
    return changes.length !== 0;
  }

  getSlotProps({fill: _a, inline: _b, className: _c, reduxState: _d, defaultComponent_: _e, queryData: _f, ...rest} = this.props) {
    return rest;
  }

  getChildren(props = this.props) {
    const {plugins} = this.context;
    return plugins.getSlotElements(props.fill, props.reduxState, this.getSlotProps(props), props.queryData);
  }

  render() {
    const {plugins} = this.context;
    const {inline = false, className, reduxState, defaultComponent: DefaultComponent, queryData} = this.props;
    let children = this.getChildren();
    const pluginConfig = reduxState.config.pluginConfig || emptyConfig;
    if (children.length === 0 && DefaultComponent) {
      const props = plugins.getSlotComponentProps(DefaultComponent, reduxState, this.getSlotProps(this.props), queryData);
      children = <DefaultComponent {...props} />;
    }

    return (
      <div className={cn({[styles.inline]: inline, [styles.debug]: pluginConfig.debug}, className)}>
        {children}
      </div>
    );
  }
}

Slot.propTypes = {
  fill: React.PropTypes.string.isRequired,

  // props coming from graphql must be passed through this property.
  queryData: React.PropTypes.object,
};

const mapStateToProps = (state) => ({
  reduxState: omit(state, 'apollo'),
});

export default connect(mapStateToProps, null)(Slot);


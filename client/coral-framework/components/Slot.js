import React from 'react';
import cn from 'classnames';
import styles from './Slot.css';
import {connect} from 'react-redux';
import {getSlotElements, getSlotComponentProps} from 'coral-framework/helpers/plugins';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';
import {getShallowChanges} from 'coral-framework/utils';
import PropTypes from 'prop-types';

const emptyConfig = {};

class Slot extends React.Component {
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

  getSlotProps(props = this.props) {
    const {
      fill: _a,
      inline: _b,
      className: _c,
      reduxState: _d,
      defaultComponent_: _e,
      queryData: _f,
      childFactory: _g,
      component: _h,
      ...rest
    } = props;
    return rest;
  }

  getChildren(props = this.props) {
    return getSlotElements(props.fill, props.reduxState, this.getSlotProps(props), props.queryData);
  }

  render() {
    const {
      inline = false,
      className,
      reduxState,
      component: Component,
      childFactory,
      defaultComponent: DefaultComponent,
      queryData,
    } = this.props;
    let children = this.getChildren();
    const pluginConfig = reduxState.config.pluginConfig || emptyConfig;
    if (children.length === 0 && DefaultComponent) {
      children = <DefaultComponent {...getSlotComponentProps(DefaultComponent, reduxState, this.getSlotProps(this.props), queryData)} />;
    }

    if (childFactory) {
      children = children.map(childFactory);
    }

    return (
      <Component className={cn({[styles.inline]: inline, [styles.debug]: pluginConfig.debug}, className)}>
        {children}
      </Component>
    );
  }
}

Slot.defaultProps = {
  component: 'div',
};

Slot.propTypes = {
  fill: PropTypes.string.isRequired,

  /**
   * You may specify the component to use as the root wrapper.
   * Defaults to 'div'.
   */
  component: PropTypes.any,

  // props coming from graphql must be passed through this property.
  queryData: PropTypes.object,

  /**
   * You may need to apply reactive updates to a child as it is exiting.
   * This is generally done by using `cloneElement` however in the case of an exiting
   * child the element has already been removed and not accessible to the consumer.
   *
   * If you do need to update a child as it leaves you can provide a `childFactory`
   * to wrap every child, even the ones that are leaving.
   *
   * @type Function(child: ReactElement) -> ReactElement
   */
  childFactory: PropTypes.func,
};

const mapStateToProps = (state) => ({
  reduxState: omit(state, 'apollo'),
});

export default connect(mapStateToProps, null)(Slot);


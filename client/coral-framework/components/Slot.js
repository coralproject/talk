import React from 'react';
import cn from 'classnames';
import styles from './Slot.css';
import { connect } from 'react-redux';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { getShallowChanges } from 'coral-framework/utils';

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
      const prevChildrenKeys = this.getChildren(this.props).map(
        child => child.key
      );
      const nextChildrenKeys = this.getChildren(next).map(child => child.key);
      return !isEqual(prevChildrenKeys, nextChildrenKeys);
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
    const { plugins } = this.context;
    return plugins.getSlotElements(
      props.fill,
      props.reduxState,
      this.getSlotProps(props),
      props.queryData
    );
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
      fill,
    } = this.props;
    const { plugins } = this.context;
    let children = this.getChildren();
    const pluginConfig = reduxState.config.pluginConfig || emptyConfig;
    if (children.length === 0 && DefaultComponent) {
      const props = plugins.getSlotComponentProps(
        DefaultComponent,
        reduxState,
        this.getSlotProps(this.props),
        queryData
      );
      children = <DefaultComponent {...props} />;
    }

    if (childFactory) {
      children = children.map(childFactory);
    }

    return (
      <Component
        className={cn(
          { [styles.inline]: inline, [styles.debug]: pluginConfig.debug },
          className,
          `talk-slot-${kebabCase(fill)}`
        )}
      >
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
  inline: PropTypes.bool,
  className: PropTypes.string,
  reduxState: PropTypes.object,
  defaultComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),

  /**
   * You may specify the component to use as the root wrapper.
   * Defaults to 'div'.
   */
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),

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

const mapStateToProps = state => ({
  reduxState: state,
});

export default connect(mapStateToProps, null)(Slot);

import React from 'react';
import cn from 'classnames';
import styles from './Slot.css';
import { connect } from 'react-redux';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import { getShallowChanges } from 'coral-framework/utils';
import omit from 'lodash/omit';

const emptyConfig = {};

class Slot extends React.Component {
  static contextTypes = {
    plugins: PropTypes.object,
  };

  shouldComponentUpdate(next) {
    // Prevent Slot from rerendering when only reduxState has changed and
    // it does not result in a change of slot children.
    const changes = getShallowChanges(this.props, next);

    // Handle special `passthrough` props.
    const passthroughIndex = changes.indexOf('passthrough');
    if (passthroughIndex !== -1) {
      if (!this.props.passthrough || next.passthrough) {
        return true;
      }
      if (
        getShallowChanges(this.props.passthrough, next.passthrough).lenght === 0
      ) {
        changes.splice(passthroughIndex, 1);
      }
    }

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

  getPassthrough(props = this.props) {
    const slotProps = omit(props, [
      'fill',
      'inline',
      'className',
      'reduxState',
      'size',
      'defaultComponent',
      'queryData',
      'childFactory',
      'component',
      'passthrough',
      'dispatch',
    ]);

    // @Deprecated
    if (process.env.NODE_ENV !== 'production') {
      if (Object.keys(slotProps).length) {
        /* eslint-disable no-console */
        console.warn(
          `Slot '${
            props.fill
          }' passing through unknown props is deprecated, please use 'passthrough' instead`,
          slotProps
        );
        /* eslint-enable no-console */
      }
    }

    if (props.passthrough) {
      return props.passthrough;
    }

    if (props.queryData) {
      if (process.env.NODE_ENV !== 'production') {
        /* eslint-disable no-console */
        console.warn(
          `Slot '${
            props.fill
          }' property 'queryData' is deprecated, please use 'passthrough' instead`
        );
        /* eslint-enable no-console */
      }
      return {
        ...props.queryData,
        ...slotProps,
      };
    }

    return slotProps;
  }

  getChildren(props = this.props) {
    const { size = 0 } = props;
    const { plugins } = this.context;

    return plugins.getSlotElements(
      props.fill,
      props.reduxState,
      this.getPassthrough(props),
      { size }
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
      fill,
    } = this.props;
    const { plugins } = this.context;
    let children = this.getChildren();
    const pluginConfig =
      get(reduxState, 'config.plugins_config') || emptyConfig;
    if (children.length === 0 && DefaultComponent) {
      const props = plugins.getSlotComponentProps(
        DefaultComponent,
        reduxState,
        this.getPassthrough()
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
   * Specifies the number of children that can fill the slot.
   */
  size: PropTypes.number,

  /**
   * You may specify the component to use as the root wrapper.
   * Defaults to 'div'.
   */
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),

  // props coming from graphql must be passed through this property.
  // @Deprecated
  queryData: PropTypes.object,

  // props that are passed to all Slot Components
  passthrough: PropTypes.object,

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

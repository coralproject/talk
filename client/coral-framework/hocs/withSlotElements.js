import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { getShallowChanges } from 'coral-framework/utils';
import { compose } from 'recompose';
import hoistStatics from 'recompose/hoistStatics';
import isFunction from 'lodash/isFunction';

function resolvePrimitiveOrFunction(primitiveOrFunction, props) {
  if (isFunction(primitiveOrFunction)) {
    return primitiveOrFunction(props);
  }
  return primitiveOrFunction;
}

const createHOC = ({
  slot,
  defaultComponent = null,
  passthroughPropName = 'passthrough',
  size = null,
  propName = 'slotElements',
}) =>
  hoistStatics(WrappedComponent => {
    return class withSlotElements extends React.Component {
      static contextTypes = {
        plugins: PropTypes.object,
      };

      static propTypes = {
        reduxState: PropTypes.object,
      };

      getSlots(props = this.props) {
        const tmp = resolvePrimitiveOrFunction(slot, props);
        if (Array.isArray(tmp)) {
          return tmp;
        }
        return [tmp];
      }

      getDefaultComponents(props = this.props, fill = 1) {
        const tmp = resolvePrimitiveOrFunction(defaultComponent, props);
        if (Array.isArray(tmp)) {
          return tmp;
        }
        return new Array(fill).fill(tmp);
      }

      getSizes(props = this.props, fill = 1) {
        const tmp = resolvePrimitiveOrFunction(size, props);
        if (Array.isArray(tmp)) {
          return tmp;
        }
        return new Array(fill).fill(tmp);
      }

      getPassthrough(props = this.props) {
        return passthroughPropName ? props[passthroughPropName] : null;
      }

      shouldComponentUpdate(next) {
        // Prevent Slot from rerendering when only reduxState has changed and
        // it does not result in a change of slot children.
        const changes = getShallowChanges(this.props, next);

        // Handle special `passthrough` props.
        if (passthroughPropName) {
          const passthroughIndex = changes.indexOf(passthroughPropName);
          if (passthroughIndex !== -1) {
            if (!this.props[passthroughPropName] || next[passthroughPropName]) {
              return true;
            }
            if (
              getShallowChanges(
                this.props[passthroughPropName],
                next[passthroughPropName]
              ).lenght === 0
            ) {
              changes.splice(passthroughIndex, 1);
            }
          }
        }

        if (changes.length === 1 && changes[0] === 'reduxState') {
          // If config changed, we'll have to rerender everything.
          // Should only happen during development as this is
          // usually static.
          if (this.props.reduxState.config !== next.reduxState.config) {
            return true;
          }

          const prevChildrenKeys = this.getSlotElements(this.props).map(
            child => child.key
          );
          const nextChildrenKeys = this.getSlotElements(next).map(
            child => child.key
          );
          return !isEqual(prevChildrenKeys, nextChildrenKeys);
        }

        // Prevent Slot from rerendering when no props has shallowly changed.
        return changes.length !== 0;
      }

      /**
       * Returns slot elements for configured slots. If only one slot is given
       * slot elements are returned directly. If more than one slot is specified
       * returns an array of slot elements.
       */
      getSlotElements(props = this.props) {
        const { plugins } = this.context;
        const slots = this.getSlots(props);
        const sizes = this.getSizes(props, slots.length);
        const defaultComponents = this.getDefaultComponents(
          props,
          slots.length
        );
        const slotPassthrough = this.getPassthrough(props);

        if (process.env.NODE_ENV !== 'production') {
          if (slotPassthrough.data && slotPassthrough.data.refetch) {
            /* eslint-disable no-console */
            console.warn(
              'Slots no longer need `data` property.',
              'Plugins can use the new HOCs `withRefetch`,',
              '`withFetchMore`, `withSubscribeToMore` and `withVariables` instead.',
              'Affected slots: ',
              slots
            );
            /* eslint-enable no-console */
          }
        }

        const elements = [];
        slots.forEach((s, i) => {
          const DefaultComponent = defaultComponents[i];
          const size = sizes[i];
          const slotElements = plugins.getSlotElements(
            s,
            props.reduxState,
            slotPassthrough,
            { size }
          );

          if (slotElements.length === 0 && DefaultComponent) {
            const p = plugins.getSlotComponentProps(
              DefaultComponent,
              props.reduxState,
              slotPassthrough
            );
            slotElements.push(<DefaultComponent key="default" {...p} />);
          }

          elements.push(slotElements);
        });

        if (elements.length === 1) {
          return elements[0];
        }

        return elements;
      }

      render() {
        const { reduxState: _a, ...rest } = this.props;
        const slotElements = this.getSlotElements();
        const props = {
          [propName]: slotElements,
          ...rest,
        };
        return <WrappedComponent {...props} />;
      }
    };
  });

const mapStateToProps = state => ({
  reduxState: state,
});

/**
 * Exports a HOC that provides a property `slotElements`.
 * @param  {Object}         [options]                      configuration
 * @param  {string|array}   [options.slot]                 Slot name or Array of Slot Names
 * @param  {element|array}  [options.defaultComponent]     Default Components or Array of such
 * @param  {number|array}   [options.size]                 Slot size or an Array of slot size
 * @param  {string}         [options.passthroughPropName]  The property to find the passthrough prop
 * @param  {string}         [options.propName]             New property name, defaults to `slotElements`
 *
 * @return {func}           Returns a HOC that per default provides the property `slotElements` with an
 *                          Array of Slot Elements or in case of multiple slots, an Array of Slot Element
 *                          Arrays.
 *
 * Example:
 * withSlotElements({
 *  slot: 'awesomeSlot',
 *  size: 1,
 * })(MyComponent);
 */
export default settings => {
  return compose(
    connect(
      mapStateToProps,
      null
    ),
    createHOC(settings)
  );
};

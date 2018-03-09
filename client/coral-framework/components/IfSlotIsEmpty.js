import React, { Children } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getShallowChanges } from 'coral-framework/utils';
import omit from 'lodash/omit';

class IfSlotIsEmpty extends React.Component {
  static contextTypes = {
    plugins: PropTypes.object,
  };

  shouldComponentUpdate(next) {
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

    // Prevent Slot from rerendering when only reduxState has changed and
    // it does not result in a change.
    if (changes.length === 1 && changes[0] === 'reduxState') {
      return this.isSlotEmpty(this.props) !== this.isSlotEmpty(next);
    }

    // Prevent Slot from rerendering when no props has shallowly changed.
    return changes.length !== 0;
  }

  getPassthrough(props = this.props) {
    const slotProps = omit(props, [
      'slot',
      'children',
      'reduxState',
      'passthrough',
      'dispatch',
    ]);

    // @Deprecated
    if (process.env.NODE_ENV !== 'production') {
      if (Object.keys(slotProps).length) {
        /* eslint-disable no-console */
        console.warn(
          `IfSlotIsEmpty '${
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

  isSlotEmpty(props = this.props) {
    const { slot, reduxState } = props;
    const passthrough = this.getPassthrough(props);
    const slots = Array.isArray(slot) ? slot : [slot];
    return slots.every(slot =>
      this.context.plugins.isSlotEmpty(slot, reduxState, passthrough)
    );
  }

  render() {
    const { children } = this.props;
    return this.isSlotEmpty() ? Children.only(children) : null;
  }
}

IfSlotIsEmpty.propTypes = {
  slot: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  children: PropTypes.node.isRequired,
  passthrough: PropTypes.object,
};

const mapStateToProps = state => ({
  reduxState: state,
});

export default connect(mapStateToProps, null)(IfSlotIsEmpty);

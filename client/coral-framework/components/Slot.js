import React from 'react';
import cn from 'classnames';
import styles from './Slot.css';
import { connect } from 'react-redux';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { withSlotElements, withCompatPassthrough } from '../hocs';
import { compose } from 'recompose';

class Slot extends React.Component {
  render() {
    const {
      inline = false,
      className,
      debug,
      component: Component,
      childFactory,
      fill,
    } = this.props;
    let children = this.props.slotElements;
    if (childFactory) {
      children = children.map(childFactory);
    }

    return (
      <Component
        className={cn(
          { [styles.inline]: inline, [styles.debug]: debug },
          className,
          `talk-slot-${kebabCase(fill)}`
        )}
        data-slot-name={fill}
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
  debug: PropTypes.bool,
  slotElements: PropTypes.arrayOf(PropTypes.element).isRequired,
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

const omitProps = [
  'fill',
  'inline',
  'className',
  'size',
  'defaultComponent',
  'queryData',
  'childFactory',
  'component',
];

const mapStateToProps = state => ({
  debug: get(state, 'config.plugins_config.debug'),
});

export default compose(
  withCompatPassthrough(omitProps),
  withSlotElements({
    slot: props => props.fill,
    size: props => props.size,
    defaultComponent: props => props.defaultComponent,
  }),
  connect(
    mapStateToProps,
    null
  )
)(Slot);

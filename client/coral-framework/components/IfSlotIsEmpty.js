import React from 'react';
import {connect} from 'react-redux';
import {isSlotEmpty} from 'coral-framework/helpers/plugins';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import {getShallowChanges} from 'coral-framework/utils';

class IfSlotIsEmpty extends React.Component {

  shouldComponentUpdate(next) {

    // Prevent Slot from rerendering when only reduxState has changed and
    // it does not result in a change.
    const changes = getShallowChanges(this.props, next);
    if (changes.length === 1 && changes[0] === 'reduxState') {
      return this.isSlotEmpty(this.props) !== this.isSlotEmpty(next);
    }

    // Prevent Slot from rerendering when no props has shallowly changed.
    return changes.length !== 0;
  }

  isSlotEmpty(props = this.props) {
    const {slot, className: _a, reduxState, component: _b = 'div', children: _c, ...rest} = props;
    return isSlotEmpty(slot, reduxState, rest);
  }

  render() {
    const {className, component: Component = 'div', children} = this.props;
    return (
      <Component className={className}>
        {this.isSlotEmpty() ? children : null}
      </Component>
    );
  }
}

IfSlotIsEmpty.propTypes = {
  slot: PropTypes.string,
  className: PropTypes.string,
};

const mapStateToProps = (state) => ({
  reduxState: omit(state, 'apollo'),
});

export default connect(mapStateToProps, null)(IfSlotIsEmpty);


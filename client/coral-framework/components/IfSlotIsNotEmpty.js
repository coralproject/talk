import React, {Children} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import {getShallowChanges} from 'coral-framework/utils';

class IfSlotIsNotEmpty extends React.Component {
  static contextTypes = {
    plugins: PropTypes.object,
  };

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
    return this.context.plugins.isSlotEmpty(slot, reduxState, rest);
  }

  render() {
    const {children} = this.props;
    return this.isSlotEmpty() ? null : Children.only(children);
  }
}

IfSlotIsNotEmpty.propTypes = {
  slot: PropTypes.string,
};

const mapStateToProps = (state) => ({
  reduxState: omit(state, 'apollo'),
});

export default connect(mapStateToProps, null)(IfSlotIsNotEmpty);


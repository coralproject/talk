import React from 'react';
import { Tab } from 'coral-ui';
import PropTypes from 'prop-types';

/**
 *  ExtendableTab adds a hover property to its children, because
 *  Tab is rendered as a button and under Firefox its children do
 *  not support mouse events.
 */
class ExtendableTab extends React.Component {
  state = {
    hover: false,
  };

  handleMouseEnter = () => this.setState({ hover: true });
  handleMouseLeave = () => this.setState({ hover: false });

  render() {
    return (
      <Tab
        {...this.props}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {React.cloneElement(this.props.children, { hover: this.state.hover })}
      </Tab>
    );
  }
}

ExtendableTab.propTypes = {
  children: PropTypes.node,
};

export default ExtendableTab;

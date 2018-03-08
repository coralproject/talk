import React from 'react';
import PropTypes from 'prop-types';

const ModerationLayout = props => <div>{props.children}</div>;

ModerationLayout.propTypes = {
  children: PropTypes.node,
};

export default ModerationLayout;

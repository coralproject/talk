import React, {PropTypes} from 'react';
import {Icon as IconMDL}  from 'react-mdl';

const Icon = ({className = '', name}) => (
  <IconMDL className={className} name={name} />
);

Icon.propTypes = {
  name: PropTypes.string.isRequired
};

export default Icon;

import React from 'react';
import {Icon as IconMDL}  from 'react-mdl';

const Icon = ({className = '', name}) => (
  <IconMDL className={className} name={name} />
);

export default Icon;

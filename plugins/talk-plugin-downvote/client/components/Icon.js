import React from 'react';
import cn from 'classnames';

export default ({ className }) => (
  <i
    className={cn('fa', 'fa-arrow-circle-down', className)}
    aria-hidden="true"
  />
);

import React from 'react';
import cn from 'classnames';

export default ({ className }) => (
  <i className={cn('fa', 'fa-arrow-circle-up', className)} aria-hidden="true" />
);

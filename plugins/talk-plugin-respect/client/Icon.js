import React from 'react';
import cn from 'classnames';

// @TODO change icon when we deprecate FA
export default ({ className }) => (
  <i className={cn('fa', 'fa-handshake-o', className)} aria-hidden="true" />
);

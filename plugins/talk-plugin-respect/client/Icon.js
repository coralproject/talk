import React from 'react';
import cn from 'classnames';

export default ({ className }) => (
  <i className={cn('fa', 'fa-handshake-o', className)} aria-hidden="true" />
);

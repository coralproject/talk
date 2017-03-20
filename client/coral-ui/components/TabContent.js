import React from 'react';

export default ({ children, show = true }) => (
  show ? <div>{children}</div> : null
);


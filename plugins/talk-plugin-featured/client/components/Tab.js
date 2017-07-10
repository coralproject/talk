import React from 'react';
import {TabCount} from 'plugin-api/beta/client/components/ui';

// TODO: This is just example code, and needs to replaced by an actual implementation.
export default ({active, asset: {recentComments}}) => (
  <span>
    Featured <TabCount active={active} sub>{recentComments.length}</TabCount>
  </span>
);

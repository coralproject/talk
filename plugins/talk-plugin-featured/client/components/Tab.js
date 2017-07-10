import React from 'react';
import {TabCount} from 'plugin-api/beta/client/components/ui';

export default ({active, asset: {recentComments}}) => (
  <span>
    Featured <TabCount active={active} sub>{recentComments.length}</TabCount>
  </span>
);

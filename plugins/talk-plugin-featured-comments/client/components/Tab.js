import React from 'react';
import {TabCount} from 'plugin-api/beta/client/components/ui';
import {t} from 'plugin-api/beta/client/services';

export default ({active, asset: {featuredCommentsCount}}) => (
  <span>
    {t('talk-plugin-featured-comments.featured')} <TabCount active={active} sub>{featuredCommentsCount}</TabCount>
  </span>
);

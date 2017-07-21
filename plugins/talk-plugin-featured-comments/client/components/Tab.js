import React from 'react';
import {TabCount} from 'plugin-api/beta/client/components/ui';
import InfoIcon from './InfoIcon';
import {t} from 'plugin-api/beta/client/services';
import Tooltip from './Tooltip';

export default ({active, asset: {featuredCommentsCount}, tooltip, ...props}) => { 
  return (
    <span 
      onMouseEnter={props.showTooltip}
      onMouseLeave={props.hideTooltip} >
      {t('talk-plugin-featured-comments.featured')}
      <TabCount active={active} sub>{featuredCommentsCount}</TabCount>
      <InfoIcon tooltip={tooltip} /> 
      {tooltip && <Tooltip />} 
    </span>
  );
};

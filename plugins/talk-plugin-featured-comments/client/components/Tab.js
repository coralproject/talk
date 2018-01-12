import React from 'react';
import { TabCount } from 'plugin-api/beta/client/components/ui';
import InfoIcon from './InfoIcon';
import { t } from 'plugin-api/beta/client/services';
import Tooltip from './Tooltip';
import PropTypes from 'prop-types';

const Tab = ({ active, hover, featuredCommentsCount }) => {
  return (
    <span>
      {t('talk-plugin-featured-comments.featured')}
      <TabCount active={active} sub>
        {featuredCommentsCount}
      </TabCount>
      <InfoIcon hover={hover} />
      {hover && <Tooltip />}
    </span>
  );
};

Tab.propTypes = {
  active: PropTypes.bool,
  hover: PropTypes.bool,
  featuredCommentsCount: PropTypes.number.isRequired,
};

export default Tab;

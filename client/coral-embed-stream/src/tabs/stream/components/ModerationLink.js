import React from 'react';
import PropTypes from 'prop-types';
import styles from './ModerationLink.css';
import cn from 'classnames';

import t from 'coral-framework/services/i18n';
import { BASE_PATH } from 'coral-framework/constants/url';

const ModerationLink = props =>
  props.isAdmin ? (
    <div
      className={cn(
        styles.moderationLink,
        'talk-embed-stream-moderation-container'
      )}
    >
      <a
        className="talk-embed-stream-moderation-link"
        href={`${BASE_PATH}admin/moderate/${props.assetId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('moderate_this_stream')}
      </a>
    </div>
  ) : null;

ModerationLink.propTypes = {
  assetId: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

export default ModerationLink;

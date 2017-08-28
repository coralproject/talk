import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';

import t from 'coral-framework/services/i18n';
import {BASE_PATH} from 'coral-framework/constants/url';

const ModerationLink = (props) => props.isAdmin ? (
    <div className={styles.moderationLink}>
      <a href={`${BASE_PATH}admin/moderate/${props.assetId}`} target="_blank">
        {t('moderate_this_stream')}
      </a>
    </div>
  ) : null;

ModerationLink.propTypes = {
  assetId: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired
};

export default ModerationLink;

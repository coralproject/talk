import React, {PropTypes} from 'react';
import styles from './styles.css';

import t from 'coral-i18n/services/i18n';

const ModerationLink = (props) => props.isAdmin ? (
    <div className={styles.moderationLink}>
      <a href={`/admin/moderate/${props.assetId}`} target="_blank">
        {t('moderate_this_stream')}
      </a>
    </div>
  ) : null;

ModerationLink.propTypes = {
  assetId: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired
};

export default ModerationLink;

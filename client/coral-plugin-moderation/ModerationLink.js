import React, {PropTypes} from 'react';
import styles from './styles.css';

import I18n from 'coral-i18n/modules/i18n/i18n';

const lang = new I18n();

const ModerationLink = (props) => props.isAdmin ? (
    <div className={styles.moderationLink}>
      <a href={`/admin/moderate/${props.assetId}`} target="_blank">
        {lang.t('moderate_this_stream')}
      </a>
    </div>
  ) : null;

ModerationLink.propTypes = {
  assetId: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired
};

export default ModerationLink;

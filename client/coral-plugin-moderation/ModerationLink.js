import React, { PropTypes } from 'react';
import styles from './styles.css';

import { I18n } from '../coral-framework';
import translations from './translations.json';

const ModerationLink = props => props.isAdmin ? (
    <div className={styles.moderationLink}>
      <a href={`/admin/moderate/${props.assetId}`} target="_blank">
        {lang.t('MODERATE_THIS_STREAM')}
      </a>
    </div>
  ) : null;

ModerationLink.propTypes = {
  assetId: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired
};

const lang = new I18n(translations);

export default ModerationLink;

import React from 'react';
import { FlagLabel } from 'plugin-api/beta/client/components/ui';
import { t } from 'plugin-api/beta/client/services';

const SpamLabel = () => (
  <FlagLabel iconName="bug_report">{t('talk-plugin-akismet.spam')}</FlagLabel>
);

export default SpamLabel;

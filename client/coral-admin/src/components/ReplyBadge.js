import React from 'react';
import {Badge} from 'coral-ui';
import t from 'coral-framework/services/i18n';

const ReplyBadge = () => (
  <Badge icon="reply">
    {t('modqueue.reply')}
  </Badge>
);

export default ReplyBadge;

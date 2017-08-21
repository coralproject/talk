import React from 'react';
import {Badge} from 'coral-ui';
import t from 'coral-framework/services/i18n';

const ReplyBadge = ({hasParent}) => hasParent ?
  <Badge icon="reply">
    {t('modqueue.reply')}
  </Badge>
  : null;

export default ReplyBadge;

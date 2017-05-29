import React from 'react';
import {timeago} from 'coral-framework/services/i18n';

const name = 'coral-plugin-pubdate';

const PubDate = ({created_at}) => <div className={`${name}-text`}>
  {timeago(created_at)}
</div>;

export default PubDate;

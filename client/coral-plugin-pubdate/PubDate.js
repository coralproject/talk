import React from 'react';
import {I18n} from '../coral-framework';

import timeago from 'timeago.js';

const lang = new I18n();
const name = 'coral-plugin-pubdate';

const PubDate = ({created_at}) => <div className={`${name  }-text`}>
  {timeago().format(created_at, lang.getLocale().replace('-', '_'))}

</div>;

export default PubDate;

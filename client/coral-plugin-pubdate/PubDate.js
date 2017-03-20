import React from 'react';
import { I18n } from '../coral-framework';

const lang = new I18n();
const name = 'coral-plugin-pubdate';

const PubDate = ({ created_at, className = '' }) => (
  <div className={`${name}-text ${className}`}>
    {lang.timeago(created_at)}
  </div>
);

export default PubDate;

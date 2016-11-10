import React from 'react';
import {I18n} from '../coral-framework';

const name = 'coral-plugin-replies';

const ReplyButton = (props) => <button
    className={`${name}-reply-button`}
    onClick={() => props.updateItem(props.id || props.parent_id, 'showReply', true, 'comments')}>
    <i className={`${name}-icon material-icons`}
      aria-hidden={true}>reply</i>
    {lang.t('reply')}
</button>;

export default ReplyButton;

const lang = new I18n({
  en: {
    'reply': 'Reply'
  },
  es: {
    'reply': '¡traduceme!'
  }
});

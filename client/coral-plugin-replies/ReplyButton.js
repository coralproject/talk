import React from 'react';
import {I18n} from '../coral-framework';
import translations from './translations.json';

const name = 'coral-plugin-replies';

const ReplyButton = (props) => <button
    className={`${name}-reply-button`}
    onClick={() => {
      if (props.banned) {
        return;
      }
      props.updateItem(props.id, 'showReply', !props.showReply, 'comments');
    }}>
    {lang.t('reply')}
    <i className={`${name}-icon material-icons`}
      aria-hidden={true}>reply</i>
</button>;

export default ReplyButton;

const lang = new I18n(translations);

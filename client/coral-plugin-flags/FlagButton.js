import React from 'react';
import {I18n} from '../coral-framework';
import translations from './translations.json';

const name = 'coral-plugin-flags';

const FlagButton = ({flag, id, postAction, addItem, updateItem, addNotification}) => {
  const flagged = flag && flag.current_user;
  const onFlagClick = () => {
    if (!flagged) {
      postAction(id, 'flag', '123', 'comments')
        .then((action) => {
          addItem({...action, current_user:true}, 'actions');
          updateItem(action.item_id, action.action_type, action.id, 'comments');
        });
      addNotification('success', lang.t('flag-notif'));
    }
  };

  return <div className={`${name  }-container`}>
    <button onClick={onFlagClick} className={`${name  }-button`}>
      {
        flagged
        ? <span className={`${name}-button-text`}>{lang.t('flagged')}</span>
      : <span className={`${name}-button-text`}>{lang.t('flag')}</span>
      }
      <i className={`${name  }-icon material-icons ${flagged && 'flaggedIcon'}`}
        style={flagged && styles.flaggedIcon}
        aria-hidden={true}>flag</i>
    </button>
  </div>;
};

export default FlagButton;

const styles = {
  flaggedIcon: {
    color: '#F00'
  },
  unflaggedIcon: {
    color: 'inherit'
  }
};

const lang = new I18n(translations);

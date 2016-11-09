import React from 'react'

const name='coral-plugin-flags'

const FlagButton = ({flag, id, postAction, addItem, updateItem, addNotification}) => {
  const flagged = flag && flag.current_user
  const onFlagClick = () => {
    postAction(id, 'flag', '123', 'comments')
      .then((action) => {
        addItem({...action, current_user:true}, 'actions')
        updateItem(action.item_id, action.action_type, action.id, 'comments')
      })
    addNotification('success', 'Thank you for reporting this comment. Our moderation team has been notified and will review it shortly.')
  }

  return <div className={name + '-container'}>
    <button onClick={onFlagClick} className={name + '-button'}>
      <i className={name + '-icon material-icons'}
        style={flagged ? styles.flaggedIcon : styles.unflaggedIcon}
        aria-hidden={true}>flag</i>
      {
        flagged
        ? <span className={name + '-button-text'}>Flagged</span>
        : <span className={name + '-button-text'}>Flag</span>
      }
    </button>
  </div>
}

export default FlagButton

const styles = {
  flaggedIcon: {
    color: '#F00'
  },
  unflaggedIcon: {
    color: 'inherit'
  }
}

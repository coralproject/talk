import React, {Component} from 'react';
import {I18n} from '../coral-framework';
import translations from './translations.json';
import {PopupMenu, Button} from 'coral-ui';

const name = 'coral-plugin-flags';

export default class FlagButton extends Component {

  state = {
    showMenu: false,
    itemType: '',
    reason: ''
  }

  onFlagClick = () => {
    if (!this.props.currentUser) {
      return;
    }
    this.setState({showMenu: !this.state.showMenu});
  }

  render () {
    const {flag} = this.props;
    // const {flag, id, postAction, deleteAction, addItem, updateItem, addNotification, currentUser} = this.props;
    const flagged = flag && flag.current_user;
    // const onFlagClick = () => {

    //   if (!flagged) {
    //     postAction(id, 'flag', currentUser.id, 'comments')
    //       .then((action) => {
    //         let id = `${action.action_type}_${action.item_id}`;
    //         addItem({id, current_user: action, count: flag ? flag.count + 1 : 1}, 'actions');
    //         updateItem(action.item_id, action.action_type, id, 'comments');
    //       });
    //     addNotification('success', lang.t('flag-notif'));
    //   } else {
    //     deleteAction(flagged.id)
    //       .then(() => {
    //         updateItem(id, 'flag', '', 'comments');
    //       });
    //     addNotification('success', lang.t('flag-notif-remove'));
    //   }
    // };

    return <div className={`${name}-container`}>
      {
        this.state.showMenu &&
        <PopupMenu className={`${name}-popup`}>
          <div className={`${name}-popup-header`}>{lang.t('report-header')}</div>
          <form className={`${name}-popup-form`}>
            <input className={`${name}-popup-radio`} type="radio" id='r1' value="user"/>
            <label for="r1" className={`${name}-popup-radio-label`}>Flag username</label><br/>
            <input className={`${name}-popup-radio`} type="radio" id='r1' value="commment"/>
            <label for="r1" className={`${name}-popup-radio-label`}>Flag comment</label><br/>
          </form>
          <div className={`${name}-popup-counter`}>
            1 of 3
          </div>
          <Button className={`${name}-popup-button`}>
            Continue
          </Button>
        </PopupMenu>
      }
      <button onClick={this.onFlagClick} className={`${name}-button`}>
        {
          flagged
          ? <span className={`${name}-button-text`}>{lang.t('reported')}</span>
        : <span className={`${name}-button-text`}>{lang.t('report')}</span>
        }
        <i className={`${name}-icon material-icons ${flagged && 'flaggedIcon'}`}
          style={flagged ? styles.flaggedIcon : {}}
          aria-hidden={true}>flag</i>
      </button>
    </div>;
  }
}

const styles = {
  flaggedIcon: {
    color: '#F00'
  },
  unflaggedIcon: {
    color: 'inherit'
  }
};

const lang = new I18n(translations);

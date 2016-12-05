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
        <PopupMenu>
          <span className={`${name}-popup-header`}>{lang.t('report-header')}</span>
          <form>
            <input type="radio" value="user"/> Flag username<br/>
            <input type="radio" value="commment"/> Flag comment<br/>
          </form>
          <Button style={
            {
              float: 'right',
              marginTop: 10,
            }}>
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

import React, {Component} from 'react';
import {I18n} from '../coral-framework';
import translations from './translations.json';
import {PopupMenu, Button} from 'coral-ui';
import onClickOutside from 'react-onclickoutside';

const name = 'coral-plugin-flags';

class FlagButton extends Component {

  state = {
    showMenu: false,
    itemType: '',
    reason: '',
    note: '',
    step: 0,
    posted: false
  }

  // When the "report" button is clicked expand the menu
  onReportClick = () => {
    if (!this.props.currentUser) {
      const offset = document.getElementById(`c_${this.props.id}`).getBoundingClientRect().top - 75;
      this.props.showSignInDialog(offset);
      return;
    }
    this.setState({showMenu: !this.state.showMenu});
  }

  onPopupContinue = () => {
    const {postAction, addItem, updateItem, flag, id, author_id} = this.props;
    const {itemType, field, reason, step, note, posted} = this.state;

    // Proceed to the next step or close the menu if we've reached the end
    if (step + 1 >= this.props.getPopupMenu.length) {
      this.setState({showMenu: false});
    } else {
      this.setState({step: step + 1});
    }

    // If itemType and reason are both set, post the action
    if (itemType && reason && !posted) {
      
      // Set the text from the "other" field if it exists.
      let item_id;
      switch(itemType) {
      case 'comments':
        item_id = id;
        break;
      case 'user':
        item_id = author_id;
        break;
      }
      const action = {
        action_type: 'flag',
        metadata: {
          field,
          reason,
          note
        }
      };
      postAction(item_id, itemType, action)
        .then((action) => {
          let id = `${action.action_type}_${action.item_id}`;
          addItem({id, current_user: action, count: flag ? flag.count + 1 : 1}, 'actions');
          updateItem(action.item_id, action.action_type, id, action.item_type);
          this.setState({posted: true});
        });
    }
  }

  onPopupOptionClick = (sets) => (e) => {

    // If the "other" option is clicked, show the other textbox
    if(sets === 'reason' && e.target.value === 'other') {
      this.setState({showOther: true});
    }

    // If flagging a user, indicate that this is referencing the username rather than the bio
    if(sets === 'itemType' && e.target.value === 'user') {
      this.setState({field: 'username'});
    }

    // Set itemType and field if they are defined in the popupMenu
    const currentMenu = this.props.getPopupMenu[this.state.step]();
    if (currentMenu.itemType) {
      this.setState({itemType: currentMenu.itemType});
    }
    if (currentMenu.field) {
      this.setState({field: currentMenu.field});
    }

    this.setState({[sets]: e.target.value});
  }

  onOtherTextChange = (e) => {
    this.setState({note: e.target.value});
  }

  handleClickOutside () {
    this.setState({showMenu: false});
  }

  render () {
    const {flag, getPopupMenu} = this.props;
    const flagged = flag && flag.current_user;
    const popupMenu = getPopupMenu[this.state.step](this.state.itemType);

    return <div className={`${name}-container`}>
      <button onClick={this.onReportClick} className={`${name}-button`}>
        {
          flagged
          ? <span className={`${name}-button-text`}>{lang.t('reported')}</span>
        : <span className={`${name}-button-text`}>{lang.t('report')}</span>
        }
        <i className={`${name}-icon material-icons ${flagged && 'flaggedIcon'}`}
          style={flagged ? styles.flaggedIcon : {}}
          aria-hidden={true}>flag</i>
      </button>
      {
        this.state.showMenu &&
        <div className={`${name}-popup`}>
          <PopupMenu>
            <div className={`${name}-popup-header`}>{popupMenu.header}</div>
            {
              popupMenu.text &&
              <div className={`${name}-popup-text`}>{popupMenu.text}</div>
            }
            {
              popupMenu.options && <form className={`${name}-popup-form`}>
                {
                  popupMenu.options.map((option) =>
                    <div key={option.val}>
                      <input
                        className={`${name}-popup-radio`}
                        type="radio"
                        id={option.val}
                        checked={this.state[popupMenu.sets] === option.val}
                        onClick={this.onPopupOptionClick(popupMenu.sets)}
                        value={option.val}/>
                      <label htmlFor={option.val} className={`${name}-popup-radio-label`}>{option.text}</label><br/>
                    </div>
                  )
                }
                {
                  this.state.reason && <div>
                  <label htmlFor={'note'} className={`${name}-popup-radio-label`}>
                    {lang.t('flag-reason')}
                  </label><br/>
                <textarea
                      className={`${name}-other-text`}
                      id="note"
                      rows={4}
                      onChange={this.onOtherTextChange}
                      value={this.state.note}/>
                  </div>
                }
              </form>
            }
            <div className={`${name}-popup-counter`}>
              {this.state.step + 1} of {getPopupMenu.length}
            </div>
            {
              popupMenu.button && <Button
              className={`${name}-popup-button`}
              onClick={this.onPopupContinue}>
                {popupMenu.button}
              </Button>
            }
          </PopupMenu>
        </div>
      }
    </div>;
  }
}

export default onClickOutside(FlagButton);

const styles = {
  flaggedIcon: {
    color: '#F00'
  },
  unflaggedIcon: {
    color: 'inherit'
  }
};

const lang = new I18n(translations);

import React, {Component} from 'react';
import {I18n} from '../coral-framework';
import translations from './translations.json';
import {PopupMenu, Button} from 'coral-ui';
import onClickOutside from 'react-onclickoutside';

const name = 'coral-plugin-flags';

class FlagButton extends Component {

  state = {
    showMenu: false,
    showOther: false,
    itemType: '',
    detail: '',
    otherText: '',
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
    const {itemType, field, detail, step, otherText, posted} = this.state;

    //Proceed to the next step or close the menu if we've reached the end
    if (step + 1 >= this.getPopupMenu.length) {
      this.setState({showMenu: false});
    } else {
      this.setState({step: step + 1});
    }

    // If itemType and detail are both set, post the action
    if (itemType && detail && !posted) {
      // Set the text from the "other" field if it exists.
      const updatedDetail = otherText || detail;
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
        field,
        detail: updatedDetail
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
    if(sets === 'detail' && e.target.value === 'other') {
      this.setState({showOther: true});
    }

    // If flagging a user, indicate that this is referencing the username rather than the bio
    if(sets === 'itemType' && e.target.value === 'user') {
      this.setState({field: 'username'});
    }

    this.setState({[sets]: e.target.value});
  }

  onOtherTextChange = (e) => {
    this.setState({otherText: e.target.value});
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
                  this.state.showOther && <div>
                    <input
                      className={`${name}-other-text`}
                      type="text"
                      id="otherText"
                      onChange={this.onOtherTextChange}
                      value={this.state.otherText}/>
                    <label htmlFor={'otherText'} className={`${name}-popup-radio-label screen-reader-text`}>
                      lang.t('flag-reason')
                    </label><br/>
                  </div>
                }
              </form>
            }
            <div className={`${name}-popup-counter`}>
              {this.state.step + 1} of {this.getPopupMenu.length}
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

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
    localPost: null,
    localDelete: false
  }

  // When the "report" button is clicked expand the menu
  onReportClick = () => {
    const {currentUser, flag, deleteAction} = this.props;
    const {localPost, localDelete} = this.state;
    const flagged = (flag && flag.current && !localDelete) || localPost;
    if (!currentUser) {
      const offset = document.getElementById(`c_${this.props.id}`).getBoundingClientRect().top - 75;
      this.props.showSignInDialog(offset);
      return;
    }
    if (flagged) {
      this.setState((prev) => prev.localPost ? {...prev, localPost: null, step: 0} : {...prev, localDelete: true});
      deleteAction(localPost || flag.current.id);
    } else {
      this.setState({showMenu: !this.state.showMenu});
    }
  }

  onPopupContinue = () => {
    const {postAction, id, author_id} = this.props;
    const {itemType, reason, step, localPost} = this.state;

    // Proceed to the next step or close the menu if we've reached the end
    if (step + 1 >= this.props.getPopupMenu.length) {
      this.setState({showMenu: false});
    } else {
      this.setState({step: step + 1});
    }

    // If itemType and reason are both set, post the action
    if (itemType && reason && !localPost) {

      // Set the text from the "other" field if it exists.
      let item_id;
      switch(itemType) {
      case 'COMMENTS':
        item_id = id;
        break;
      case 'USERS':
        item_id = author_id;
        break;
      }

      // Note: Action metadata has been temporarily removed.
      if (itemType === 'COMMENTS') {
        this.setState({localPost: 'temp'});
      }
      postAction({
        item_id,
        item_type: itemType,
        action_type: 'FLAG'
      }).then(({data}) => {
        if (itemType === 'COMMENTS') {
          this.setState({localPost: data.createAction.id});
        }
      });
    }
  }

  onPopupOptionClick = (sets) => (e) => {

    // If flagging a user, indicate that this is referencing the username rather than the bio
    if(sets === 'itemType' && e.target.value === 'users') {
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

  onNoteTextChange = (e) => {
    this.setState({note: e.target.value});
  }

  handleClickOutside () {
    this.setState({showMenu: false});
  }

  render () {
    const {flag, getPopupMenu} = this.props;
    const {localPost, localDelete} = this.state;
    const flagged = (flag && flag.current && !localDelete) || localPost;
    const popupMenu = getPopupMenu[this.state.step](this.state.itemType);

    return <div className={`${name}-container`}>
      <button onClick={!this.props.banned ? this.onReportClick : null} className={`${name}-button`}>
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
                      className={`${name}-reason-text`}
                      id="note"
                      rows={4}
                      onChange={this.onNoteTextChange}
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

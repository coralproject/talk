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
    message: '',
    step: 0,
    posted: false,
    localPost: null,
    localDelete: false
  }

  // When the "report" button is clicked expand the menu
  onReportClick = () => {
    const {currentUser, flag, deleteAction} = this.props;
    const {localPost, localDelete} = this.state;
    const flagged = (flag && flag.current_user && !localDelete) || localPost;
    if (!currentUser) {
      this.props.showSignInDialog();
      return;
    }
    if (flagged) {
      this.setState((prev) => prev.localPost ? {...prev, localPost: null, step: 0} : {...prev, localDelete: true});
      deleteAction(localPost || flag.current_user.id);
    } else if (this.state.showMenu){
      this.closeMenu();
    } else {
      this.setState({showMenu: true});
    }
  }

  closeMenu = () => {
    this.setState({
      showMenu: false,
      itemType: '',
      reason: '',
      message: '',
      step: 0
    });
  }

  onPopupContinue = () => {
    const {postFlag, postDontAgree, id, author_id} = this.props;
    const {itemType, reason, step, posted, message} = this.state;

    // Proceed to the next step or close the menu if we've reached the end
    if (step + 1 >= this.props.getPopupMenu.length) {
      this.closeMenu();
    } else {
      this.setState({step: step + 1});
    }

    // If itemType and reason are both set, post the action
    if (itemType && reason && !posted) {
      this.setState({posted: true});

      let item_id;
      switch(itemType) {
      case 'COMMENTS':
        item_id = id;
        break;
      case 'USERS':
        item_id = author_id;
        break;
      }

      if (itemType === 'COMMENTS') {
        this.setState({localPost: 'temp'});
      }

      let action = {
        item_id,
        item_type: itemType,
        reason: null,
        message
      };
      if (reason === 'I don\'t agree with this comment') {
        postDontAgree(action)
        .then(({data}) => {
          if (itemType === 'COMMENTS') {
            this.setState({localPost: data.createDontAgree.dontagree.id});
          }
        });
      } else {
        postFlag({...action, reason})
        .then(({data}) => {
          if (itemType === 'COMMENTS') {
            this.setState({localPost: data.createFlag.flag.id});
          }
        });
      }
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
    this.setState({message: e.target.value});
  }

  handleClickOutside () {
    this.closeMenu();
  }

  render () {
    const {flag, getPopupMenu} = this.props;
    const {localPost, localDelete} = this.state;
    const flagged = (flag && flag.current_user && !localDelete) || localPost;
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
                  <label htmlFor={'message'} className={`${name}-popup-radio-label`}>
                    {lang.t('flag-reason')}
                  </label><br/>
                  <textarea
                      className={`${name}-reason-text`}
                      id="message"
                      rows={4}
                      onChange={this.onNoteTextChange}
                      value={this.state.message}/>
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

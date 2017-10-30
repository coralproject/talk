import React, {Component} from 'react';

import t from 'coral-framework/services/i18n';
import {can} from 'coral-framework/services/perms';

import {PopupMenu, Button} from 'coral-ui';
import ClickOutside from 'coral-framework/components/ClickOutside';
import cn from 'classnames';
import styles from './styles.css';

import {getErrorMessages} from 'coral-framework/utils';

const name = 'talk-plugin-flags';

export default class FlagButton extends Component {

  state = {
    showMenu: false,
    itemType: '',
    reason: '',
    message: '',
    step: 0,
    posted: false,
    localPost: null
  }

  componentDidUpdate () {
    if (this.popup) { // this will be defined when the reporting popup is opened
      this.popup.firstChild.style.top = `${this.flagButton.offsetTop - this.popup.firstChild.clientHeight - 15}px`;
    }
  }

  // When the "report" button is clicked expand the menu
  onReportClick = () => {
    const {currentUser} = this.props;
    if (!currentUser) {
      this.props.showSignInDialog();
      return;
    }
    if (can(currentUser, 'INTERACT_WITH_COMMUNITY')) {
      if (this.state.showMenu) {
        this.closeMenu();
      } else {
        this.setState({showMenu: true});
      }
    } else {
      this.props.notify('error', t('error.NOT_AUTHORIZED'));
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
      if (reason === 'COMMENT_NOAGREE') {
        postDontAgree(action)
          .then(({data}) => {
            if (itemType === 'COMMENTS') {
              this.setState({localPost: data.createDontAgree.dontagree.id});
            }
          })
          .catch((err) => {
            this.props.notify('error', getErrorMessages(err));
            console.error(err);
          });
      } else {
        postFlag({...action, reason})
          .then(({data}) => {
            if (itemType === 'COMMENTS') {
              this.setState({localPost: data.createFlag.flag.id});
            }
          })
          .catch((err) => {
            this.props.notify('error', getErrorMessages(err));
            console.error(err);
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

  handleClickOutside = () => {
    if (this.state.showMenu) {
      this.closeMenu();
    }
  }

  render () {
    const {getPopupMenu, flaggedByCurrentUser} = this.props;
    const {localPost} = this.state;
    const flagged = flaggedByCurrentUser || localPost;
    const popupMenu = getPopupMenu[this.state.step](this.state.itemType);

    return (
      <ClickOutside onClickOutside={this.handleClickOutside}>
        <div className={`${name}-container`}>
          <button
            disabled={flagged}
            ref={(ref) => this.flagButton = ref}
            onClick={!this.props.banned && !flaggedByCurrentUser && !localPost ? this.onReportClick : null}
            className={
              cn(`${name}-button`, {
                [`${name}-button-flagged`]: flagged,
                [styles.flaggedButton]: flagged
              },
              styles.button)}
          >
            {
              flagged
                ? <span className={`${name}-button-text`}>{t('reported')}</span>
                : <span className={`${name}-button-text`}>{t('report')}</span>
            }
            <i className={
              cn(`${name}-icon`, 'material-icons', styles.icon, {
                flaggedIcon: flagged,
                [styles.flaggedIcon]: flagged,
              })}
            aria-hidden={true}>flag</i>
          </button>
          {
            this.state.showMenu &&
            <div className={`${name}-popup`} ref={(ref) => this.popup = ref}>
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
                          {t('flag_reason')}
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
        </div>
      </ClickOutside>
    );
  }
}

import React, { Component } from 'react';

import t from 'coral-framework/services/i18n';
import { can } from 'coral-framework/services/perms';

import { PopupMenu, Button } from 'coral-ui';
import ClickOutside from 'coral-framework/components/ClickOutside';
import cn from 'classnames';
import styles from './FlagButton.css';
import * as REASONS from 'coral-framework/graphql/flagReasons';
import PropTypes from 'prop-types';

import { getErrorMessages, forEachError } from 'coral-framework/utils';

// TODO: (kiwi) Need to adapt CSS classes post refactor to match the rest.
const name = 'talk-plugin-flags';

export default class FlagButton extends Component {
  state = {
    showMenu: false,
    itemType: '',
    reason: '',
    message: '',
    step: 0,
    localPost: null,
  };

  componentDidUpdate() {
    if (this.popup) {
      // this will be defined when the reporting popup is opened
      this.popup.firstChild.style.top = `${this.flagButton.offsetTop -
        this.popup.firstChild.clientHeight -
        15}px`;
    }
  }

  // When the "report" button is clicked expand the menu
  onReportClick = () => {
    const { currentUser } = this.props;
    if (!currentUser) {
      this.props.showSignInDialog();
      return;
    }
    if (can(currentUser, 'INTERACT_WITH_COMMUNITY')) {
      if (this.state.showMenu) {
        this.closeMenu();
      } else {
        this.setState({ showMenu: true });
      }
    } else {
      this.props.notify('error', t('error.NOT_AUTHORIZED'));
    }
  };

  closeMenu = () => {
    this.setState({
      showMenu: false,
      itemType: '',
      reason: '',
      message: '',
      step: 0,
    });
  };

  onPopupContinue = async () => {
    const { postFlag, postDontAgree, id, author_id } = this.props;
    const { itemType, reason, step, message } = this.state;
    let failed = false;

    switch (step) {
      case 0:
        if (!itemType) {
          return;
        }
        break;
      case 1:
        if (!reason) {
          return;
        }
        break;
      case 2:
        return this.closeMenu();
      default:
        throw new Error(`Unexpected step ${step}`);
    }

    // If itemType and reason are both set, post the action
    if (step === 1) {
      let item_id;
      switch (itemType) {
        case 'COMMENTS':
          item_id = id;
          break;
        case 'USERS':
          item_id = author_id;
          break;
        default:
          throw new Error(`Unexpected itemType ${itemType}`);
      }

      let action = {
        item_id,
        item_type: itemType,
        message,
      };

      if (reason === REASONS.comment.noagree) {
        const result = await postDontAgree(action);
        try {
          if (itemType === 'COMMENTS') {
            this.setState({
              localPost: result.data.createDontAgree.dontagree.id,
            });
          }
        } catch (err) {
          this.props.notify('error', getErrorMessages(err));
          console.error(err);
          failed = true;
        }
      } else {
        try {
          const result = await postFlag({ ...action, reason });
          if (itemType === 'COMMENTS') {
            this.setState({ localPost: result.data.createFlag.flag.id });
          }
        } catch (errors) {
          forEachError(errors, ({ error, msg }) => {
            if (error.translation_key === 'ALREADY_EXISTS') {
              msg = t('already_flagged_username');
            }
            this.props.notify('error', msg);
          });
          failed = true;
        }
      }
    }

    if (!failed) {
      this.setState({ step: step + 1 });
    }
  };

  onPopupOptionClick = sets => e => {
    // If flagging a user, indicate that this is referencing the username rather than the bio
    if (sets === 'itemType' && e.target.value === 'users') {
      this.setState({ field: 'username' });
    }

    // Set itemType and field if they are defined in the popupMenu
    const currentMenu = this.props.getPopupMenu[this.state.step]();
    if (currentMenu.itemType) {
      this.setState({ itemType: currentMenu.itemType });
    }
    if (currentMenu.field) {
      this.setState({ field: currentMenu.field });
    }

    this.setState({ [sets]: e.target.value });
  };

  onNoteTextChange = e => {
    this.setState({ message: e.target.value });
  };

  handleClickOutside = () => {
    if (this.state.showMenu) {
      this.closeMenu();
    }
  };

  render() {
    const { getPopupMenu, flaggedByCurrentUser } = this.props;
    const { localPost } = this.state;
    const flagged = flaggedByCurrentUser || localPost;
    const popupMenu = getPopupMenu[this.state.step](this.state.itemType);

    return (
      <ClickOutside onClickOutside={this.handleClickOutside}>
        <div className={`${name}-container`}>
          <button
            disabled={flagged}
            ref={ref => (this.flagButton = ref)}
            onClick={
              !this.props.banned && !flaggedByCurrentUser && !localPost
                ? this.onReportClick
                : null
            }
            className={cn(
              `${name}-button`,
              {
                [`${name}-button-flagged`]: flagged,
                [styles.flaggedButton]: flagged,
              },
              styles.button
            )}
          >
            {flagged ? (
              <span className={`${name}-button-text`}>{t('reported')}</span>
            ) : (
              <span className={`${name}-button-text`}>{t('report')}</span>
            )}
            <i
              className={cn(`${name}-icon`, 'material-icons', styles.icon, {
                flaggedIcon: flagged,
                [styles.flaggedIcon]: flagged,
              })}
              aria-hidden={true}
            >
              flag
            </i>
          </button>
          {this.state.showMenu && (
            <div className={`${name}-popup`} ref={ref => (this.popup = ref)}>
              <PopupMenu>
                <div className={`${name}-popup-header`}>{popupMenu.header}</div>
                {popupMenu.text && (
                  <div className={`${name}-popup-text`}>{popupMenu.text}</div>
                )}
                {popupMenu.options && (
                  <form className={`${name}-popup-form`}>
                    {popupMenu.options.map(option => (
                      <div key={option.val}>
                        <input
                          className={`${name}-popup-radio`}
                          type="radio"
                          id={option.val}
                          checked={this.state[popupMenu.sets] === option.val}
                          onClick={this.onPopupOptionClick(popupMenu.sets)}
                          value={option.val}
                        />
                        <label
                          htmlFor={option.val}
                          className={`${name}-popup-radio-label`}
                        >
                          {option.text}
                        </label>
                        <br />
                      </div>
                    ))}
                    {this.state.reason && (
                      <div>
                        <label
                          htmlFor={'message'}
                          className={`${name}-popup-textarea-label`}
                        >
                          {t('flag_reason')}
                        </label>
                        <br />
                        <textarea
                          className={`${name}-reason-text`}
                          id="message"
                          rows={4}
                          onChange={this.onNoteTextChange}
                          value={this.state.message}
                        />
                      </div>
                    )}
                  </form>
                )}
                <div className={`${name}-popup-counter`}>
                  {this.state.step + 1} of {getPopupMenu.length}
                </div>
                {popupMenu.button && (
                  <Button
                    className={`${name}-popup-button`}
                    onClick={this.onPopupContinue}
                  >
                    {popupMenu.button}
                  </Button>
                )}
              </PopupMenu>
            </div>
          )}
        </div>
      </ClickOutside>
    );
  }
}

FlagButton.propTypes = {
  currentUser: PropTypes.object,
  showSignInDialog: PropTypes.func,
  notify: PropTypes.func,
  getPopupMenu: PropTypes.array,
  flaggedByCurrentUser: PropTypes.bool,
  banned: PropTypes.bool,
};

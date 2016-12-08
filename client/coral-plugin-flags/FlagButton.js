import React, {Component} from 'react';
import {I18n} from '../coral-framework';
import translations from './translations.json';
import {PopupMenu, Button} from 'coral-ui';

const name = 'coral-plugin-flags';

export default class FlagButton extends Component {

  state = {
    showMenu: false,
    itemType: '',
    reason: '',
    step: 1
  }

  onReportClick = () => {
    if (!this.props.currentUser) {
      this.props.showSignInDialog();
      return;
    }
    this.setState({showMenu: !this.state.showMenu});
  }

  onPopupContinue = () => {
    const {postAction, addItem, updateItem, currentUser, flag, id, author_id} = this.props;
    const {itemType, field, detail, step} = this.state;

    this.setState({step: step + 1});

    if (itemType && detail) {
      const item_id = itemType === 'comments' ? id : author_id;
      postAction(item_id, 'flag', currentUser.id, itemType, field, detail)
        .then((action) => {
          let id = `${action.action_type}_${action.item_id}`;
          addItem({id, current_user: action, count: flag ? flag.count + 1 : 1}, 'actions');
          updateItem(action.item_id, action.action_type, id, action.item_type);
        });
    }
  }

  getPopupMenu = (step) => {
    switch(step) {
    case 1: {
      return {
        header: 'Report an issue',
        options: [
          {val: 'user', text: 'Flag username'},
          {val: 'comments', text: 'Flag comment'},
        ],
        button: 'Continue',
        sets: 'itemType'
      };
    }
    case 2: {
      const options = this.state.itemType === 'comments' ?
      [
        {val: 'I don\'t agree with this comment', text: 'I don\'t agree with this comment'},
        {val: 'This comment is offensive', text: 'This comment is offensive'},
        {val: 'This comment reveals personally identifiable inforation without consent', text: 'This comment reveals personally identifiable inforation without consent'},
        {val: 'Other', text: 'Other'},
      ]
      : [
        {val: 'This username is offensive', text: 'This username is offensive'},
        {val: 'I don\'t like this username', text: 'I don\'t like this username'},
        {val: 'This looks like an ad/marketing', text: 'This looks like an ad/marketing'},
        {val: 'Other', text: 'Other'},
      ];
      return {
        header: 'Help us understand',
        options,
        button: 'Continue',
        sets: 'detail'
      };
    }
    case 3: {
      return {
        header: 'Thank you for your input',
        text: 'We value your safety and feedback. A moderator will review your flag.'
      };
    }}
  }

  onPopupOptionClick = (sets) => (e) => {
    this.setState({[sets]: e.target.value});

    // If flagging a user, indicate that this is referencing the username rather than the bio
    if(sets === 'itemType' && e.target.value === 'user') {
      this.setState({field: 'username'});
    }
  }

  render () {
    const {flag} = this.props;
    const flagged = flag && flag.current_user;
    const popupMenu = this.getPopupMenu(this.state.step);

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
              </form>
            }
            <div className={`${name}-popup-counter`}>
              {this.state.step} of 3
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

const styles = {
  flaggedIcon: {
    color: '#F00'
  },
  unflaggedIcon: {
    color: 'inherit'
  }
};

const lang = new I18n(translations);

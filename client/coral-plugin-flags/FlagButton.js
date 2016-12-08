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
    step: 1
  }

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
    const {itemType, field, detail, step, otherText} = this.state;

    this.setState({step: step + 1});

    if (itemType && detail) {
      console.log('OtherText', otherText);
      const updatedDetail = otherText || detail;
      const item_id = itemType === 'comments' ? id : author_id;
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
        });
    }
  }

  getPopupMenu = (step) => {
    switch(step) {
    case 1: {
      return {
        header: lang.t('step-1-header'),
        options: [
          {val: 'user', text: lang.t('flag-username')},
          {val: 'comments', text: lang.t('flag-comment')}
        ],
        button: lang.t('continue'),
        sets: 'itemType'
      };
    }
    case 2: {
      const options = this.state.itemType === 'comments' ?
      [
        {val: 'I don\'t agree with this comment', text: lang.t('no-agree-comment')},
        {val: 'This comment is offensive', text: lang.t('comment-offensive')},
        {val: 'This comment reveals personally identifiable infomration', text: lang.t('personal-info')},
        {val: 'other', text: lang.t('other')}
      ]
      : [
        {val: 'This username is offensive', text: lang.t('username-offensive')},
        {val: 'I don\'t like this username', text: lang.t('no-like-username')},
        {val: 'This looks like an ad/marketing', text: lang.t('marketing')},
        {val: 'other', text: lang.t('other')}
      ];
      return {
        header: lang.t('step-2-header'),
        options,
        button: lang.t('continue'),
        sets: 'detail'
      };
    }
    case 3: {
      return {
        header: lang.t('step-3-header'),
        text: lang.t('thank-you')
      };
    }}
  }

  onPopupOptionClick = (sets) => (e) => {
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

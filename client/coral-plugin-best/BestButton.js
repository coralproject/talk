import React, {Component, PropTypes} from 'react';
import {I18n} from '../coral-framework';
import translations from './translations.json';
import classnames from 'classnames';

const name = 'coral-plugin-best';
const lang = new I18n(translations);

/**
 * Button that lets a moderator tag a comment as "Best".
 * Used to recognize really good comments.
 */
class BestButton extends Component {
  static propTypes = {

    // whether the comment is already tagged as best
    isBest: PropTypes.bool.isRequired,

    // set that this comment is best
    setBestTag: PropTypes.func.isRequired,

    // remove the best status
    removeBestTag: PropTypes.func.isRequired,
  }

  state = {
    best: false
  }

  constructor(props) {
    super(props);
    this.onClickSetBest = this.onClickSetBest.bind(this);
    this.onClickUnsetBest = this.onClickUnsetBest.bind(this);
  }

  onClickSetBest(e) {
    e.preventDefault();
    this.setState({isBest: true});
  }

  onClickUnsetBest(e) {
    e.preventDefault();
    this.setState({isBest: false});
  }

  render() {

    // @TODO(bengo) Consider adding the comment__action classes to other buttons to add cursor:pointer and never wrap the icons
    // @TODO(bengo) Should I reuse another element like coral-ui button? Just doing what LikeButton does for now
    // Oh. I think that's styled for the admin. Don't use coral-ui button until the whole comment bottom bar does.
    const {isBest} = this.state;
    return <div className={classnames(`${name}-container`, `${name}-button`, 'comment__action-button--nowrap',
                                      `e2e__${isBest ? 'unset' : 'set'}-best-comment`)}>
      <button onClick={isBest ? this.onClickUnsetBest : this.onClickSetBest}
              className='comment__action-button'>
        <span className={`${name}-button-text`}>{lang.t(isBest ? 'unsetBest' : 'setBest')}</span>
        <i className={`${name}-icon material-icons`} aria-hidden={true}>
          { isBest ? 'favorite' : 'favorite_border' }
        </i>
      </button>
    </div>;
  }
}

export default BestButton;

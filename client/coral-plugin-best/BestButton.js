import React, {Component, PropTypes} from 'react';
import {I18n} from '../coral-framework';
import translations from './translations.json';
import classnames from 'classnames';

// tag string for best comments
export const BEST_TAG = 'BEST';
export const commentIsBest = ({tags} = {}) => {
  const isBest = Array.isArray(tags) && tags.some(t => t.name === BEST_TAG);
  return isBest;
};

const name = 'coral-plugin-best';
const lang = new I18n(translations);

// It would be best if the backend/api held this business logic
const canModifyBestTag = ({roles = []} = {}) => roles && ['ADMIN', 'MODERATOR'].some(role => roles.includes(role));

/**
 * Component that only renders children if the provided user prop can modify best tags
 */
export const IfUserCanModifyBest = ({user, children}) => {
  if ( ! ( user && canModifyBestTag(user))) {return null;}
  return children;
};

/**
 * Button that lets a moderator tag a comment as "Best".
 * Used to recognize really good comments.
 */
export class BestButton extends Component {
  static propTypes = {

    // whether the comment is already tagged as best
    isBest: PropTypes.bool.isRequired,

    // set that this comment is best
    addBest: PropTypes.func.isRequired,

    // remove the best status
    removeBest: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.onClickAddBest = this.onClickAddBest.bind(this);
    this.onClickRemoveBest = this.onClickRemoveBest.bind(this);
  }

  async onClickAddBest(e) {
    e.preventDefault();
    const {addBest} = this.props;
    if ( ! addBest) {
      console.warn('BestButton#onClickAddBest called even though there is no addBest prop. doing nothing');
      return;
    }
    const addBestRet = await addBest();
    console.log('addBestRet', addBestRet);
  }

  async onClickRemoveBest(e) {
    e.preventDefault();
    const {removeBest} = this.props;
    if ( ! removeBest) {
      console.warn('BestButton#onClickAddBest called even though there is no removeBest prop. doing nothing');
      return;
    }
    const removeBestRet = await removeBest();
    console.log('removeBestRet', removeBestRet);
  }

  render() {

    // @TODO(bengo) Consider adding the comment__action classes to other buttons to add cursor:pointer and never wrap the icons
    // @TODO(bengo) Should I reuse another element like coral-ui button? Just doing what LikeButton does for now
    // Oh. I think that's styled for the admin. Don't use coral-ui button until the whole comment bottom bar does.
    const {isBest, addBest, removeBest} = this.props;
    return <div className={classnames(`${name}-container`, `${name}-button`, 'comment__action-button--nowrap',
                                      `e2e__${isBest ? 'unset' : 'set'}-best-comment`)}>
      <button onClick={isBest ? this.onClickRemoveBest : this.onClickAddBest}
              disabled={ ! (isBest ? removeBest : addBest)}
              className='comment__action-button'>
        <span className={`${name}-button-text`}>{lang.t(isBest ? 'unsetBest' : 'setBest')}</span>
        <i className={`${name}-icon material-icons`} aria-hidden={true}>
          { isBest ? 'favorite' : 'favorite_border' }
        </i>
      </button>
    </div>;
  }
}

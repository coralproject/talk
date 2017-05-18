import React, {Component, PropTypes} from 'react';
import {I18n} from '../coral-framework';
import translations from './translations.json';
import {Icon} from 'coral-ui';
import classnames from 'classnames';

// tag string for best comments
export const BEST_TAG = 'BEST';

export const commentIsBest = ({tags} = {}) => tags.some(t => t.tag.name === BEST_TAG);

const name = 'coral-plugin-best';
const lang = new I18n(translations);

// It would be best if the backend/api held this business logic
const canModifyBestTag = ({roles = []} = {}) => roles && ['ADMIN', 'MODERATOR'].some(role => roles.includes(role));

// Put this on a comment to show that it is best

export const BestIndicator = ({children = <Icon name='star'/>}) => (
  <span aria-label={lang.t('commentIsBest')}>
    { children }
  </span>
);

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

  state = {
    isSaving: false
  }

  async onClickAddBest(e) {
    e.preventDefault();
    const {addBest} = this.props;
    if ( ! addBest) {
      console.warn('BestButton#onClickAddBest called even though there is no addBest prop. doing nothing');
      return;
    }
    this.setState({isSaving: true});
    try {
      await addBest();
    } finally {
      this.setState({isSaving: false});
    }
  }

  async onClickRemoveBest(e) {
    e.preventDefault();
    const {removeBest} = this.props;
    if ( ! removeBest) {
      console.warn('BestButton#onClickAddBest called even though there is no removeBest prop. doing nothing');
      return;
    }
    this.setState({isSaving: true});
    try {
      await removeBest();
    } finally {
      this.setState({isSaving: false});
    }
  }

  render() {
    const {isBest, addBest, removeBest} = this.props;
    const {isSaving} = this.state;
    const disabled = isSaving || ! (isBest ? removeBest : addBest);
    return (
      <button onClick={isBest ? this.onClickRemoveBest : this.onClickAddBest}
              disabled={disabled}
              className={classnames(`${name}-button`, `e2e__${isBest ? 'unset' : 'set'}-best-comment`)}
              aria-label={lang.t(isBest ? 'unsetBest' : 'setBest')}>
        <Icon name={ isBest ? 'star' : 'star_border' } />
      </button>
    );
  }
}

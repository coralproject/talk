import React, {Component} from 'react';
import {Tooltip} from 'coral-ui';
import FlagBio from 'coral-plugin-flags/FlagBio';
const packagename = 'coral-plugin-author-name';
import styles from './styles.css';

export default class AuthorName extends Component {

  state = {showTooltip: false}

  handleClick = () => {
    this.setState(state => ({
      showTooltip: !state.showTooltip
    }));
  }

  handleMouseLeave = () => {
    setTimeout(() => {
      this.setState({
        showTooltip: false
      });
    }, 500);
  }

  render () {
    const {author} = this.props;
    const {showTooltip} = this.state;
    return (
      <div className={`${packagename}-text ${styles.container}`} onClick={this.handleClick} onMouseLeave={this.handleMouseLeave}>
        <a className={styles.authorName}>
          {author && author.name}
          {author.settings.bio ? <span className={`${styles.arrowDown} ${showTooltip ? styles.arrowUp : ''}`} /> : null}
        </a>
        {showTooltip && author.settings.bio
          && (
          <Tooltip>
            <div className={`${packagename}-bio`}>
              {author.settings.bio}
            </div>
            <div className={`${packagename}-bio-flag`}>
              <FlagBio  {...this.props}/>
            </div>
          </Tooltip>
        )}
      </div>
    );
  }
}

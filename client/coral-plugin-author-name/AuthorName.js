import React, {Component} from 'react';
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
    return (
      <div
        className={`${packagename}-text`}
        className={`${styles.authorName}`}>
        {author && author.name}
      </div>
    );
  }
}

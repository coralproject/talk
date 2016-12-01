import React, {Component} from 'react';
import {Tooltip} from 'coral-ui';
const packagename = 'coral-plugin-author-name';

export default class AuthorName extends Component {
  constructor (props) {
    super(props);

    this.state = {
      showTooltip: false
    };

    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleMouseOver () {
    this.setState({
      showTooltip: true
    });
  }

  handleMouseLeave () {
    this.setState({
      showTooltip: false
    });
  }

  render () {
    const {author} = this.props;
    const {showTooltip} = this.state;
    return (
      <div
        className={`${packagename}-text`}
        onMouseOver={this.handleMouseOver}
        onMouseLeave={this.handleMouseLeave}
      >
        {author && author.displayName}
        { showTooltip && <Tooltip>{author.settings.bio}</Tooltip>}
      </div>
    );
  }
}

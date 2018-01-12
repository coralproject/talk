import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';

const renderer = new marked.Renderer();

// Set link target to `_parent` to work properly in an embed.
renderer.link = (href, title, text) =>
  `<a target="_parent" href="${href}" ${
    title ? `title="${title}"` : ''
  }>${text}</a>`;

marked.setOptions({ renderer });

export default class Markdown extends PureComponent {
  render() {
    const { content, ...rest } = this.props;
    const __html = marked(content);
    return <div {...rest} dangerouslySetInnerHTML={{ __html }} />;
  }
}

Markdown.propTypes = {
  content: PropTypes.string,
};

import cn from "classnames";
import marked from "marked";
import React, { AllHTMLAttributes, PureComponent } from "react";

import styles from "./Markdown.css";

const renderer = new marked.Renderer();

// Set link target to `_parent` to work properly in an embed.
renderer.link = (href, title, text) =>
  `<a target="_parent" href="${href}" ${
    title ? `title="${title}"` : ""
  }>${text}</a>`;

marked.setOptions({ renderer, gfm: true, breaks: true });

interface Props extends AllHTMLAttributes<HTMLDivElement> {
  children: string;
}

export default class Markdown extends PureComponent<Props> {
  public render() {
    const { children, className, ...rest } = this.props;
    const html = marked(children);
    return (
      <div
        className={cn(styles.root, className)}
        {...rest}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
}

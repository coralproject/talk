import React from 'react';
import isLink from '../helpers/isLink';
import Link from './Link';

const name = 'coral-plugin-comment-content';

const CommentContent = ({comment}) => {
  const textbreaks = comment.body.split('\n');
  return <div className={`${name}-text`}>
    {
      textbreaks.map((line, i) => {
        return (
          <span key={i} className={`${name}-line`}>
            {line.split(' ').map((w) => isLink(w) ? <Link url={w} key={i} /> : ` ${w}`)}
            <br className={`${name}-linebreak`}/>
          </span>
        );
      })
    }
  </div>;
};

export default CommentContent;

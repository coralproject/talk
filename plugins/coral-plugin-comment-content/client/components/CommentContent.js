import React from 'react';
import Linkify from 'react-linkify';

const name = 'coral-plugin-comment-content';

const CommentContent = ({comment}) => {
  const textbreaks = comment.body.split('\n');
  return <div className={`${name}-text`}>
    {
      textbreaks.map((line, i) => {
        return (
          <span key={i} className={`${name}-line`}>
            <Linkify properties={{target: '_parent'}}>
              {line}
            </Linkify>
            <br className={`${name}-linebreak`}/>
          </span>
        );
      })
    }
  </div>;
};

export default CommentContent;

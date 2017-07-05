import React from 'react';

const CommentContent = ({comment}) => {
  const textbreaks = comment.body.split('\n');
  return <div className={`${name}-text`}>
    {
      textbreaks.map((line, i) => {
        return (
          <span key={i} className={`${name}-line`}>
            {line}
            <br className={`${name}-linebreak`}/>
          </span>
        );
      })
    }
  </div>;
};

export default CommentContent;

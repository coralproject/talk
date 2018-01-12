import React from 'react';

const CommentContent = ({ comment }) => {
  const textbreaks = comment.body.split('\n');
  return (
    <span className={`${name}-text`}>
      {textbreaks.map((line, i) => {
        return (
          <span key={i} className={`${name}-line`}>
            {line}
            {i === textbreaks.length - 1 && (
              <br className={`${name}-linebreak`} />
            )}
          </span>
        );
      })}
    </span>
  );
};

export default CommentContent;

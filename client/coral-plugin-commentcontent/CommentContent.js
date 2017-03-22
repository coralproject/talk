import React from 'react';
const name = 'coral-plugin-commentcontent';

const Content = ({ body, className, styles }) => {
  const textbreaks = body.split('\n');
  return (
    <div className={`${name}-text ${className}`} style={styles && styles.text}>
      {textbreaks.map((line, i) => (
        <span key={i} className={`${name}-line`}>
          {line} <br className={`${name}-linebreak`} />
        </span>
      ))}
    </div>
  );
};

export default Content;

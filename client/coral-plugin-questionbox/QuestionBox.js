import React from 'react';
const packagename = 'coral-plugin-questionbox';

const QuestionBox = ({ enable, content }) =>
<div className={`${packagename}-info ${enable ? null : 'hidden'}` }>
  <div className={`${packagename}-box`}>
    <i className={`${packagename}-icon material-icons bubble`}>chat_bubble</i>
    <i className={`${packagename}-icon material-icons person`}>person</i>
  </div>
  {content}
</div>;

export default QuestionBox;

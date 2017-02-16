import React from 'react';
const packagename = 'coral-plugin-questionbox';

const QuestionBox = ({enable, content}) =>
<div
  className={`${packagename}-info ${enable ? null : 'hidden'}` }>
  <i className={`${packagename}-icon material-icons`}>chat_bubble person</i>
  {content}
</div>;

export default QuestionBox;

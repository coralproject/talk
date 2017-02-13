import React from 'react';
const packagename = 'coral-plugin-questionbox';

const QuestionBox = ({enable, content}) =>
<div
  className={`${packagename}-info ${enable ? null : ', hidden'}` }>
  {content}
</div>;

export default QuestionBox;

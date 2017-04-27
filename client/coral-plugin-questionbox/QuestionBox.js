import React from 'react';
const packagename = 'coral-plugin-questionbox';
import Slot from 'coral-framework/components/Slot';

const QuestionBox = ({enable, content}) =>
<div className={`${packagename}-info ${enable ? null : 'hidden'}` }>
  <div className={`${packagename}-box`}>
    <i className={`${packagename}-icon material-icons bubble`}>chat_bubble</i>
    <i className={`${packagename}-icon material-icons person`}>person</i>
  </div>
  <div className={`${packagename}-content`}>
    {content}
  </div>
  <Slot fill="streamQuestionArea" />
</div>;

export default QuestionBox;

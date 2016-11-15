import React from 'react';
const packagename = 'coral-plugin-infobox';

const InfoBox = ({enable, content}) =>
<div
  className={`${packagename}-info ${enable ? '' : ', hidden'}` }>
  {content}
</div>;

export default InfoBox;

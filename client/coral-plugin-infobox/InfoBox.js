import React from 'react';
const packagename = 'coral-plugin-infobox';

const InfoBox = ({enable, content}) =>
<div
  className={`${packagename}-info`}
  hidden={`${!enable}`}>
  {content}
</div>;

export default InfoBox;

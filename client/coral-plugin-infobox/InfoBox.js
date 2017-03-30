import React from 'react';
import Markdown from './Markdown';

const packagename = 'coral-plugin-infobox';

const InfoBox = ({enable, content}) =>
<div
  className={`${packagename}-info ${enable ? '' : 'hidden'}` }>
  <Markdown content={content} />
</div>;

export default InfoBox;

import React from 'react';
import Markdown from 'coral-framework/components/Markdown';

// TODO: remove this.
const packagename = 'talk-plugin-infobox';

const InfoBox = ({ enable, content }) => (
  <div className={`${packagename}-info ${enable ? '' : 'hidden'}`}>
    <Markdown content={content} />
  </div>
);

export default InfoBox;

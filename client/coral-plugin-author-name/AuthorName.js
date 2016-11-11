import React from 'react';
const packagename = 'coral-plugin-author-name';

const AuthorName = ({name}) =>
<div className={`${packagename}-text`}>
  {name}
</div>;

export default AuthorName;

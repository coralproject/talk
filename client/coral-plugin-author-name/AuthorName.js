import React from 'react';
const packagename = 'coral-plugin-author-name';

const AuthorName = ({author}) =>
<div className={`${packagename}-text`}>
  {author && author.displayName}
</div>;

export default AuthorName;

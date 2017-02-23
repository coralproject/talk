import React from 'react';

const TagLabel = ({isStaff}) => <div className='coral-plugin-tag-label'>
  {isStaff ? 'Staff' : ''}
</div>;

export default TagLabel;

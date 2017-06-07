import React, {PropTypes} from 'react';

import t from 'coral-framework/services/i18n';

const NewCount = ({count, loadMore}) => {
  return <div className='coral-new-comments coral-load-more'>
    {
      count ?
      <button onClick={loadMore}>
        {count === 1
          ? t('framework.new_count', count, t('framework.comment'))
          : t('framework.new_count', count, t('framework.comments'))}
      </button>
      : null
    }
  </div>;
};

NewCount.propTypes = {
  count: PropTypes.number.isRequired,
  loadMore: PropTypes.func.isRequired,
};

export default NewCount;

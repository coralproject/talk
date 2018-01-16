import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'coral-ui';

import t from 'coral-framework/services/i18n';

const NewCount = ({ count, loadMore }) => {
  return (
    <div className="talk-new-comments talk-load-more">
      {count ? (
        <Button onClick={loadMore}>
          {count === 1
            ? t('framework.new_count', count, t('framework.comment'))
            : t('framework.new_count', count, t('framework.comments'))}
        </Button>
      ) : null}
    </div>
  );
};

NewCount.propTypes = {
  count: PropTypes.number.isRequired,
  loadMore: PropTypes.func.isRequired,
};

export default NewCount;

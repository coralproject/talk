import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'coral-ui';
import t from 'coral-framework/services/i18n';
import cn from 'classnames';

class LoadMore extends React.Component {
  render() {
    const { loadingState, loadMore } = this.props;
    const disabled = loadingState === 'loading';
    return (
      <div className="talk-load-more">
        <Button
          onClick={loadMore}
          className={cn('talk-load-more-button', {
            [`talk-load-more-button-${loadingState}`]: loadingState,
          })}
          disabled={disabled}
        >
          {t('framework.view_more_comments')}
        </Button>
      </div>
    );
  }
}

LoadMore.propTypes = {
  loadMore: PropTypes.func.isRequired,
  loadingState: PropTypes.oneOf(['', 'loading', 'success', 'error']),
};

export default LoadMore;

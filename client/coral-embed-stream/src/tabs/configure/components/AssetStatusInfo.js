import React from 'react';
import { Button } from 'coral-ui';
import PropTypes from 'prop-types';
import t, { timeago } from 'coral-framework/services/i18n';
import cn from 'classnames';
import styles from './AssetStatusInfo.css';

class AssetStatusInfo extends React.Component {
  timer = null;

  constructor(props) {
    super(props);
    this.setupTimer(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setupTimer(nextProps);
  }

  // Rerendering interval. If remaining time > 1min, rerender every minute, otherwise evey second.
  interval(closedAt) {
    const diff = new Date(closedAt).getTime() - new Date().getTime();
    return diff > 60000 ? 60000 : 1000;
  }

  // Timer that counts down the remaining time.
  setupTimer({ closedAt, isClosed } = this.props) {
    if (this.timer && (isClosed || !closedAt)) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (isClosed || !closedAt) {
      this.timer = null;
      return;
    }
    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.timer = null;
        this.forceUpdate();
        this.setupTimer();
      }, this.interval(closedAt));
    }
  }

  render() {
    const { isClosed, closedAt, onClose, onOpen } = this.props;
    return (
      <div className="talk-config-close-comments">
        <h3>
          {!isClosed ? t('configure.close') : t('configure.open')}{' '}
          {t('configure.comment_stream')}
        </h3>
        {!isClosed && closedAt ? (
          <p>
            {t('configure.comment_stream_will_close')}{' '}
            {timeago(new Date(closedAt))}.
          </p>
        ) : (
          ''
        )}
        <div
          className={cn('talk-config-close-comments-wrapper', styles.wrapper)}
        >
          <p>
            {!isClosed
              ? t('configure.open_stream_configuration')
              : t('configure.close_stream_configuration')}
          </p>
          <Button
            className={cn(
              styles.button,
              `talk-config-close-comments-${isClosed ? 'open' : 'close'}-button`
            )}
            onClick={!isClosed ? onClose : onOpen}
          >
            {!isClosed
              ? t('configure.close_stream')
              : t('configure.open_stream')}
          </Button>
        </div>
      </div>
    );
  }
}

AssetStatusInfo.propTypes = {
  isClosed: PropTypes.bool.isRequired,
  closedAt: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
};

export default AssetStatusInfo;

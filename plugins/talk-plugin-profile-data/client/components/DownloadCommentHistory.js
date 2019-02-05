import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { t } from 'plugin-api/beta/client/services';
import { Button } from 'plugin-api/beta/client/components/ui';
import styles from './DownloadCommentHistory.css';
import { getErrorMessages } from 'coral-framework/utils';
import { downloadRateLimitDays } from '../../config';

export const readableDuration = durAsHours => {
  const durAsDays = Math.ceil(durAsHours / 24);

  return durAsHours > 23
    ? durAsDays > 1
      ? t('download_request.days', durAsDays)
      : t('download_request.day', durAsDays)
    : durAsHours > 1
      ? t('download_request.hours', durAsHours)
      : t('download_request.hour', durAsHours);
};

class DownloadCommentHistory extends Component {
  static propTypes = {
    requestDownloadLink: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    root: PropTypes.object.isRequired,
  };

  requestDownloadLink = async () => {
    const { requestDownloadLink, notify } = this.props;
    try {
      await requestDownloadLink();
      notify('success', t('download_request.download_preparing'));
    } catch (err) {
      notify('error', getErrorMessages(err));
    }
  };

  render() {
    const {
      root: {
        me: { lastAccountDownload },
      },
    } = this.props;

    const now = new Date();
    const lastAccountDownloadDate =
      lastAccountDownload && new Date(lastAccountDownload);
    const hoursLeft = lastAccountDownloadDate
      ? Math.ceil(
          downloadRateLimitDays * 24 -
            (now.getTime() - lastAccountDownloadDate.getTime()) / 3.6e6
        )
      : 0;
    const canRequestDownload = !lastAccountDownloadDate || hoursLeft <= 0;

    return (
      <section
        className={'talk-plugin-profile-data--download-my-comment-history'}
      >
        <h3>{t('download_request.section_title')}</h3>
        <p>
          {t('download_request.you_will_get_a_copy')}{' '}
          <b>{t('download_request.download_rate', downloadRateLimitDays)}</b>.
        </p>
        {lastAccountDownloadDate && (
          <p className={styles.most_recent}>
            {t('download_request.most_recent_request')}:{' '}
            {lastAccountDownloadDate.toLocaleString()}
          </p>
        )}
        {canRequestDownload ? (
          <Button className={styles.button} onClick={this.requestDownloadLink}>
            <i className="material-icons" aria-hidden={true}>
              file_download
            </i>{' '}
            {t('download_request.request')}
          </Button>
        ) : (
          <Button className={styles.button} disabled>
            <i className="material-icons" aria-hidden={true}>
              access_time
            </i>{' '}
            {t('download_request.rate_limit', readableDuration(hoursLeft))}
          </Button>
        )}
      </section>
    );
  }
}

export default DownloadCommentHistory;

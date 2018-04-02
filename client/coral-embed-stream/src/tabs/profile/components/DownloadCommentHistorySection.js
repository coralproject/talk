import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'coral-ui';
import { compose, gql } from 'react-apollo';
import { t } from 'plugin-api/beta/client/services';
import styles from './DownloadCommentHistorySection.css';
import { withFragments, withMutation } from 'coral-framework/hocs';

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

class DownloadCommentHistorySection extends Component {
  static propTypes = {
    requestDownloadLink: PropTypes.func.isRequired,
    root: PropTypes.object.isRequired,
  };

  render() {
    const {
      root: { me: { lastAccountDownload } },
      requestDownloadLink,
    } = this.props;

    const now = new Date();
    const lastAccountDownloadDate =
      lastAccountDownload && new Date(lastAccountDownload);
    const hoursLeft = lastAccountDownloadDate
      ? Math.ceil(
          24 - (now.getTime() - lastAccountDownloadDate.getTime()) / 3.6e6
        )
      : 0;
    const canRequestDownload = !lastAccountDownloadDate || hoursLeft <= 0;

    return (
      <section className={'talk-plugin-ignore-user-section'}>
        <h3>{t('download_request.section_title')}</h3>
        <p>
          {t('download_request.you_will_get_a_copy')}{' '}
          <b>{t('download_request.download_rate')}</b>.
        </p>
        {lastAccountDownloadDate && (
          <p className={styles.most_recent}>
            {t('download_request.most_recent_request')}:{' '}
            {lastAccountDownloadDate.toLocaleString()}
          </p>
        )}
        {canRequestDownload ? (
          <Button className={styles.button} onClick={requestDownloadLink}>
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

const withDownloadCommentHistorySectionFragments = withFragments({
  root: gql`
    fragment TalkDownloadCommentHistory_DownloadCommentHistorySection_root on RootQuery {
      me {
        id
        lastAccountDownload
      }
    }
  `,
});

const withRequestDownloadLink = withMutation(
  gql`
    mutation DownloadCommentHistory {
      requestDownloadLink {
        errors {
          translation_key
        }
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      requestDownloadLink: () => mutate({ variables: {} }),
    }),
  }
);

const enhance = compose(
  withDownloadCommentHistorySectionFragments,
  withRequestDownloadLink
);

export default enhance(DownloadCommentHistorySection);

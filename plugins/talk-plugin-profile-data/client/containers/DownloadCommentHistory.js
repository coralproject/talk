import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose, gql } from 'react-apollo';
import DownloadCommentHistory from '../components/DownloadCommentHistory';
import { withFragments } from 'plugin-api/beta/client/hocs';
import { withRequestDownloadLink } from '../hocs';

class DownloadCommentHistoryContainer extends Component {
  static propTypes = {
    requestDownloadLink: PropTypes.func.isRequired,
    root: PropTypes.object.isRequired,
  };

  render() {
    return (
      <DownloadCommentHistory
        root={this.props.root}
        requestDownloadLink={this.props.requestDownloadLink}
      />
    );
  }
}

const enhance = compose(
  withFragments({
    root: gql`
      fragment TalkDownloadCommentHistory_DownloadCommentHistorySection_root on RootQuery {
        __typename
        me {
          id
          lastAccountDownload
        }
      }
    `,
  }),
  withRequestDownloadLink
);

export default enhance(DownloadCommentHistoryContainer);

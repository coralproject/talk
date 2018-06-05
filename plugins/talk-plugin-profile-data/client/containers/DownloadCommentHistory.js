import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { compose, gql } from 'react-apollo';
import DownloadCommentHistory from '../components/DownloadCommentHistory';
import { withRequestDownloadLink } from '../hocs';
import { connect, withFragments } from 'plugin-api/beta/client/hocs';
import { notify } from 'coral-framework/actions/notification';

class DownloadCommentHistoryContainer extends Component {
  static propTypes = {
    requestDownloadLink: PropTypes.func.isRequired,
    root: PropTypes.object.isRequired,
    notify: PropTypes.func.isRequired,
  };

  render() {
    return (
      <DownloadCommentHistory
        root={this.props.root}
        notify={this.props.notify}
        requestDownloadLink={this.props.requestDownloadLink}
      />
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({ notify }, dispatch);

const enhance = compose(
  connect(
    null,
    mapDispatchToProps
  ),
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

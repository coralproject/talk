import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose, gql} from 'react-apollo';
import isEqual from 'lodash/isEqual';
import withQuery from 'coral-framework/hocs/withQuery';

import {banUser, setCommentStatus, suspendUser} from '../../../graphql/mutations';

import {fetchSettings} from 'actions/settings';
import {updateAssets} from 'actions/assets';
import {
  toggleModal,
  singleView,
  showBanUserDialog,
  hideBanUserDialog,
  showSuspendUserDialog,
  hideSuspendUserDialog,
  hideShortcutsNote,
  viewUserDetail,
  hideUserDetail,
  setSortOrder,
} from 'actions/moderation';

import {Spinner} from 'coral-ui';
import Moderation from '../components/Moderation';

class ModerationContainer extends Component {
  componentWillMount() {
    this.props.fetchSettings();
  }

  componentWillReceiveProps(nextProps) {
    const {updateAssets} = this.props;
    if(!isEqual(nextProps.root.assets, this.props.root.assets)) {
      updateAssets(nextProps.root.assets);
    }
  }

  loadMore = ({limit = 10, cursor, sort, tab, asset_id}) => {
    let variables = {
      limit,
      cursor,
      sort,
      asset_id
    };
    switch(tab) {
    case 'all':
      variables.statuses = null;
      break;
    case 'accepted':
      variables.statuses = ['ACCEPTED'];
      break;
    case 'premod':
      variables.statuses = ['PREMOD'];
      break;
    case 'flagged':
      variables.statuses = ['NONE', 'PREMOD'];
      variables.action_type = 'FLAG';
      break;
    case 'rejected':
      variables.statuses = ['REJECTED'];
      break;
    }
    return this.props.data.fetchMore({
      query: LOAD_MORE_QUERY,
      variables,
      updateQuery: (oldData, {fetchMoreResult:{comments}}) => {
        return {
          ...oldData,
          [tab]: [
            ...oldData[tab],
            ...comments
          ]
        };
      }
    });
  };

  render () {
    const {root, data} = this.props;

    if (data.error) {
      return <div>Error</div>;
    }

    if (!('premodCount' in root)) {
      return <div><Spinner/></div>;
    }

    return <Moderation {...this.props} loadMore={this.loadMore} />;
  }
}

const commentView = gql`
  fragment commentView on Comment {
    id
    body
    created_at
    status
    user {
      id
      name: username
      status
    }
    asset {
      id
      title
      url
    }
    action_summaries {
      count
      ... on FlagActionSummary {
        reason
      }
    }
    actions {
      ... on FlagAction {
        reason
        message
        user {
          username
        }
      }
    }
  }
`;

const LOAD_MORE_QUERY = gql`
  query LoadMoreModQueue($limit: Int = 10, $cursor: Date, $sort: SORT_ORDER, $asset_id: ID, $statuses:[COMMENT_STATUS!], $action_type: ACTION_TYPE) {
    comments(query: {limit: $limit, cursor: $cursor, asset_id: $asset_id, statuses: $statuses, sort: $sort, action_type: $action_type}) {
      ...commentView
      action_summaries {
        count
        ... on FlagActionSummary {
          reason
        }
      }
    }
  }
  ${commentView}
`;

const withModQueueQuery = withQuery(gql`
  query ModQueue($asset_id: ID, $sort: SORT_ORDER) {
    all: comments(query: {
      statuses: [NONE, PREMOD, ACCEPTED, REJECTED],
      asset_id: $asset_id,
      sort: $sort
    }) {
      ...commentView
    }
    accepted: comments(query: {
      statuses: [ACCEPTED],
      asset_id: $asset_id,
      sort: $sort
    }) {
      ...commentView
    }
    premod: comments(query: {
        statuses: [PREMOD],
        asset_id: $asset_id,
        sort: $sort
    }) {
        ...commentView
    }
    flagged: comments(query: {
        action_type: FLAG,
        asset_id: $asset_id,
        statuses: [NONE, PREMOD],
        sort: $sort
    }) {
        ...commentView
    }
    rejected: comments(query: {
        statuses: [REJECTED],
        asset_id: $asset_id,
        sort: $sort
    }) {
        ...commentView
    }
    assets: assets {
      id
      title
      url
    }
    allCount: commentCount(query: {
      asset_id: $asset_id
    })
    acceptedCount: commentCount(query: {
      statuses: [ACCEPTED],
      asset_id: $asset_id
    })
    premodCount: commentCount(query: {
      statuses: [PREMOD],
      asset_id: $asset_id
    })
    rejectedCount: commentCount(query: {
       statuses: [REJECTED],
       asset_id: $asset_id
    })
    flaggedCount: commentCount(query: {
      action_type: FLAG,
      asset_id: $asset_id,
      statuses: [NONE, PREMOD]
    })
    settings {
      organizationName
    }
  }
  ${commentView}
`, {
  options: ({params: {id = null}, moderation: {sortOrder}}) => {
    return {
      variables: {
        asset_id: id,
        sort: sortOrder,
      }
    };
  },
});

const withQueueCountPolling = withQuery(gql`
  query Counts($asset_id: ID) {
    allCount: commentCount(query: {
      asset_id: $asset_id
    })
    acceptedCount: commentCount(query: {
      statuses: [ACCEPTED],
      asset_id: $asset_id
    })
    premodCount: commentCount(query: {
      statuses: [PREMOD],
      asset_id: $asset_id
    })
    rejectedCount: commentCount(query: {
       statuses: [REJECTED],
       asset_id: $asset_id
    })
    flaggedCount: commentCount(query: {
      action_type: FLAG,
      asset_id: $asset_id,
      statuses: [NONE, PREMOD]
    })
  }
`, {
  options: ({params: {id = null}}) => {
    return {
      pollInterval: 5000,
      variables: {
        asset_id: id
      }
    };
  }
});

const mapStateToProps = (state) => ({
  moderation: state.moderation.toJS(),
  settings: state.settings.toJS(),
  auth: state.auth.toJS(),
  assets: state.assets.get('assets')
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    toggleModal,
    singleView,
    updateAssets,
    fetchSettings,
    showBanUserDialog,
    hideBanUserDialog,
    hideShortcutsNote,
    showSuspendUserDialog,
    hideSuspendUserDialog,
    viewUserDetail,
    hideUserDetail,
    setSortOrder,
  }, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  setCommentStatus,
  banUser,
  suspendUser,
  withQueueCountPolling,
  withModQueueQuery,
)(ModerationContainer);

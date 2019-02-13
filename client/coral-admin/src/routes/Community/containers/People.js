import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, gql } from 'react-apollo';
import People from '../components/People';
import PropTypes from 'prop-types';
import {
  withUnbanUser,
  withUnsuspendUser,
  withSetUserRole,
  withRemoveAlwaysPremodUser,
} from 'coral-framework/graphql/mutations';
import { showBanUserDialog } from 'actions/banUserDialog';
import { showSuspendUserDialog } from 'actions/suspendUserDialog';
import { showAlwaysPremodUserDialog } from 'actions/alwaysPremodUserDialog';
import { viewUserDetail } from '../../../actions/userDetail';
import { appendNewNodes } from 'plugin-api/beta/client/utils';
import update from 'immutability-helper';
import { Spinner } from 'coral-ui';
import withQuery from 'coral-framework/hocs/withQuery';

class PeopleContainer extends React.PureComponent {
  timer = null;

  state = {
    search: '',
    role: '',
    status: '',
  };

  statusToQuery = {
    active: { suspended: false, banned: false },
    suspended: { suspended: true },
    banned: { banned: true },
    alwaysPremod: { alwaysPremod: true },
  };

  onFilterChange = filter => e =>
    this.setState({ [filter]: e.target.value }, () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(this.filter, 350);
    });

  getFilterState = () => {
    const { role, status } = this.state;
    return {
      status: this.statusToQuery[status] || null,
      role: role || null,
    };
  };

  filter = () =>
    this.props.data.fetchMore({
      query: FILTER_QUERY,
      variables: {
        state: this.getFilterState(),
        value: this.state.search,
        limit: 10,
      },
      updateQuery: (previous, { fetchMoreResult: { users } }) =>
        update(previous, {
          users: {
            nodes: { $set: users.nodes },
            hasNextPage: { $set: users.hasNextPage },
            endCursor: { $set: users.endCursor },
          },
        }),
    });

  loadMore = () =>
    this.props.data.fetchMore({
      query: LOAD_MORE_QUERY,
      variables: {
        cursor: this.props.root.users.endCursor,
        state: this.getFilterState(),
        value: this.state.search,
        limit: 5,
      },
      updateQuery: (previous, { fetchMoreResult: { users } }) =>
        update(previous, {
          users: {
            nodes: {
              $apply: nodes => appendNewNodes(nodes, users.nodes),
            },
            hasNextPage: { $set: users.hasNextPage },
            endCursor: { $set: users.endCursor },
          },
        }),
    });

  render() {
    if (this.props.data.error) {
      return <div>{this.props.data.error.message}</div>;
    }

    if (this.props.data.loading) {
      return (
        <div>
          <Spinner />
        </div>
      );
    }

    return (
      <People
        onFilterChange={this.onFilterChange}
        viewUserDetail={this.props.viewUserDetail}
        setUserRole={this.props.setUserRole}
        showSuspendUserDialog={this.props.showSuspendUserDialog}
        showBanUserDialog={this.props.showBanUserDialog}
        showAlwaysPremodUserDialog={this.props.showAlwaysPremodUserDialog}
        unbanUser={this.props.unbanUser}
        unsuspendUser={this.props.unsuspendUser}
        removeAlwaysPremodUser={this.props.removeAlwaysPremodUser}
        data={this.props.data}
        root={this.props.root}
        users={this.props.root.users}
        loadMore={this.loadMore}
        filters={this.state}
      />
    );
  }
}

PeopleContainer.propTypes = {
  setUserRole: PropTypes.func.isRequired,
  unbanUser: PropTypes.func.isRequired,
  unsuspendUser: PropTypes.func.isRequired,
  removeAlwaysPremodUser: PropTypes.func.isRequired,
  viewUserDetail: PropTypes.func.isRequired,
  showSuspendUserDialog: PropTypes.func,
  showBanUserDialog: PropTypes.func,
  showAlwaysPremodUserDialog: PropTypes.func,
  data: PropTypes.object,
  root: PropTypes.object,
};

const LOAD_MORE_QUERY = gql`
  query TalkAdmin_Community_People_LoadMoreUsers(
    $limit: Int
    $cursor: Cursor
    $value: String
  ) {
    users(query: { value: $value, limit: $limit, cursor: $cursor }) {
      hasNextPage
      endCursor
      nodes {
        __typename
        id
        username
        role
        created_at
        profiles {
          id
          provider
        }
        state {
          status {
            banned {
              status
            }
            alwaysPremod {
              status
            }
            suspension {
              until
            }
          }
        }
      }
    }
  }
`;

const FILTER_QUERY = gql`
  query TalkAdmin_Community_People_FilterUsers(
    $state: UserStateInput
    $value: String
    $limit: Int
  ) {
    users(query: { state: $state, value: $value, limit: $limit }) {
      hasNextPage
      endCursor
      nodes {
        __typename
        id
        username
        role
        created_at
        profiles {
          id
          provider
        }
        state {
          status {
            banned {
              status
            }
            alwaysPremod {
              status
            }
            suspension {
              until
            }
          }
        }
      }
    }
  }
`;

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      viewUserDetail,
      showSuspendUserDialog,
      showBanUserDialog,
      showAlwaysPremodUserDialog,
    },
    dispatch
  );

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  withSetUserRole,
  withUnsuspendUser,
  withUnbanUser,
  withRemoveAlwaysPremodUser,
  withQuery(
    gql`
      query TalkAdmin_Community_People {
        users(query: {}) {
          hasNextPage
          endCursor
          nodes {
            __typename
            id
            username
            role
            created_at
            profiles {
              id
              provider
            }
            state {
              status {
                banned {
                  status
                }
                alwaysPremod {
                  status
                }
                suspension {
                  until
                }
              }
            }
          }
        }
      }
    `,
    {
      options: {
        fetchPolicy: 'network-only',
      },
    }
  )
)(PeopleContainer);

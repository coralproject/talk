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
} from 'coral-framework/graphql/mutations';
import { showBanUserDialog } from 'actions/banUserDialog';
import { showSuspendUserDialog } from 'actions/suspendUserDialog';
import { viewUserDetail } from '../../../actions/userDetail';
import { appendNewNodes } from 'plugin-api/beta/client/utils';
import update from 'immutability-helper';
import { Spinner } from 'coral-ui';
import withQuery from 'coral-framework/hocs/withQuery';

class PeopleContainer extends React.Component {
  timer = null;

  state = {
    searchValue: '',
  };

  onSearchChange = e => {
    const { value } = e.target;
    this.setState({ searchValue: value }, () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.search(value);
      }, 350);
    });
  };

  search = async value => {
    return this.props.data.fetchMore({
      query: SEARCH_QUERY,
      variables: {
        value,
        limit: 10,
      },
      updateQuery: (previous, { fetchMoreResult: { users } }) => {
        const updated = update(previous, {
          users: {
            nodes: {
              $set: users.nodes,
            },
            hasNextPage: { $set: users.hasNextPage },
            endCursor: { $set: users.endCursor },
          },
        });
        return updated;
      },
    });
  };

  setUserRole = async (id, role) => {
    await this.props.setUserRole(id, role);
  };

  loadMore = () => {
    return this.props.data.fetchMore({
      query: LOAD_MORE_QUERY,
      variables: {
        value: this.state.searchValue,
        limit: 5,
        cursor: this.props.root.users.endCursor,
      },
      updateQuery: (previous, { fetchMoreResult: { users } }) => {
        const updated = update(previous, {
          users: {
            nodes: {
              $apply: nodes => appendNewNodes(nodes, users.nodes),
            },
            hasNextPage: { $set: users.hasNextPage },
            endCursor: { $set: users.endCursor },
          },
        });
        return updated;
      },
    });
  };

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
        onSearchChange={this.onSearchChange}
        viewUserDetail={this.props.viewUserDetail}
        setUserRole={this.setUserRole}
        showSuspendUserDialog={this.props.showSuspendUserDialog}
        showBanUserDialog={this.props.showBanUserDialog}
        unbanUser={this.props.unbanUser}
        unsuspendUser={this.props.unsuspendUser}
        data={this.props.data}
        root={this.props.root}
        users={this.props.root.users}
        loadMore={this.loadMore}
      />
    );
  }
}

PeopleContainer.propTypes = {
  setUserRole: PropTypes.func.isRequired,
  unbanUser: PropTypes.func.isRequired,
  unsuspendUser: PropTypes.func.isRequired,
  viewUserDetail: PropTypes.func.isRequired,
  showSuspendUserDialog: PropTypes.func,
  showBanUserDialog: PropTypes.func,
  data: PropTypes.object,
  root: PropTypes.object,
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      viewUserDetail,
      showSuspendUserDialog,
      showBanUserDialog,
    },
    dispatch
  );

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
            suspension {
              until
            }
          }
        }
      }
    }
  }
`;

const SEARCH_QUERY = gql`
  query TalkAdmin_Community_People_SearchUsers($value: String, $limit: Int) {
    users(query: { value: $value, limit: $limit }) {
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
            suspension {
              until
            }
          }
        }
      }
    }
  }
`;

export default compose(
  connect(null, mapDispatchToProps),
  withSetUserRole,
  withUnsuspendUser,
  withUnbanUser,
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

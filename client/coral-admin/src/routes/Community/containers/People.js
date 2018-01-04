import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose, gql} from 'react-apollo';
import People from '../components/People';
import PropTypes from 'prop-types';
import {withFragments} from 'plugin-api/beta/client/hocs';
import {withUnBanUser, withUnSuspendUser, withSetUserRole} from 'coral-framework/graphql/mutations';
import {showBanUserDialog} from 'actions/banUserDialog';
import {showSuspendUserDialog} from 'actions/suspendUserDialog';
import {viewUserDetail} from '../../../actions/userDetail';
import {appendNewNodes} from 'plugin-api/beta/client/utils';
import update from 'immutability-helper';
import {Spinner} from 'coral-ui';

class PeopleContainer extends React.Component {
  timer = null;

  state = {
    searchValue: ''
  };

  onSearchChange = (e) => {
    const {value} = e.target;
    this.setState({searchValue: value}, () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.search(value);
      }, 350);
    });
  }

  search = async (value) =>  {
    return this.props.data.fetchMore({
      query: SEARCH_QUERY,
      variables: {
        value,
        limit: 5,
      },
      updateQuery: (previous, {fetchMoreResult:{users}}) => {
        const updated = update(previous, {
          users: {
            nodes: {
              $set: users.nodes,
            },
            hasNextPage: {$set: users.hasNextPage},
            endCursor: {$set: users.endCursor},
          },
        });
        return updated;
      },
    });
  };

  setUserRole = async (id, role) => {
    await this.props.setUserRole(id, role);
  }

  loadMore = () => {
    return this.props.data.fetchMore({
      query: LOAD_MORE_QUERY,
      variables: {
        value: this.state.searchValue,
        limit: 5,
        cursor: this.props.root.users.endCursor,
      },
      updateQuery: (previous, {fetchMoreResult:{users}}) => {
        const updated = update(previous, {
          users: {
            nodes: {
              $apply: (nodes) => appendNewNodes(nodes, users.nodes),
            },
            hasNextPage: {$set: users.hasNextPage},
            endCursor: {$set: users.endCursor},
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
      return <div><Spinner/></div>;
    }

    return <People
      onSearchChange={this.onSearchChange}  
      viewUserDetail={this.props.viewUserDetail}
      setUserRole={this.setUserRole}
      showSuspendUserDialog={this.props.showSuspendUserDialog}
      showBanUserDialog={this.props.showBanUserDialog}
      unBanUser={this.props.unBanUser}
      unSuspendUser={this.props.unSuspendUser}
      data={this.props.data}
      root={this.props.root}
      users={this.props.root.users}
      loadMore={this.loadMore}
    />;
  }
}

PeopleContainer.propTypes = {
  community: PropTypes.object,
  setUserRole: PropTypes.func.isRequired,
  unBanUser: PropTypes.func.isRequired,
  unSuspendUser: PropTypes.func.isRequired,
  viewUserDetail: PropTypes.func.isRequired,
  showSuspendUserDialog: PropTypes.func,
  showBanUserDialog: PropTypes.func,
  data: PropTypes.object,
  root: PropTypes.object,
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    viewUserDetail,
    showSuspendUserDialog,
    showBanUserDialog,
  }, dispatch);

const LOAD_MORE_QUERY = gql`
  query TalkAdminCommunity_People_LoadMoreUsers($limit: Int, $cursor: Cursor, $value: String) {
    users(query: {
      value: $value,
      limit: $limit,
      cursor: $cursor
    }){
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
  query TalkAdminCommunity_People_SearchUsers($value: String, $limit: Int) {
    users(query: {
      value: $value,
      limit: $limit,
    }){
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
  withUnSuspendUser,
  withUnBanUser,
  withFragments({
    root: gql`
      fragment TalkAdminCommunity_People_root on RootQuery {
        users(query: {}){
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
  }),
)(PeopleContainer);

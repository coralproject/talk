import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import React, {Component} from 'react';
import I18n from 'coral-i18n/modules/i18n/i18n';
import {bindActionCreators} from 'redux';

import {myCommentHistory, myIgnoredUsers} from 'coral-framework/graphql/queries';
import {stopIgnoringUser} from 'coral-framework/graphql/mutations';

import {link} from 'coral-framework/services/PymConnection';
import NotLoggedIn from '../components/NotLoggedIn';
import IgnoredUsers from '../components/IgnoredUsers';
import {Spinner} from 'coral-ui';
import CommentHistory from 'coral-plugin-history/CommentHistory';
import {showSignInDialog, checkLogin} from 'coral-framework/actions/auth';

const lang = new I18n();

class ProfileContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      activeTab: 0,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(tab) {
    this.setState({
      activeTab: tab
    });
  }

  render() {
    const {asset, data, showSignInDialog, myIgnoredUsersData, stopIgnoringUser} = this.props;
    const {me} = this.props.data;

    if (data.loading) {
      return <Spinner/>;
    }

    if (!me) {
      return <NotLoggedIn showSignInDialog={showSignInDialog} />;
    }

    const localProfile = this.props.user.profiles.find(p => p.provider === 'local');
    const emailAddress = localProfile && localProfile.id;

    return (
      <div>
        <h2>{this.props.user.username}</h2>
        { emailAddress
          ? <p>{ emailAddress }</p>
          : null
        }

        {
          myIgnoredUsersData.myIgnoredUsers && myIgnoredUsersData.myIgnoredUsers.length
          ? (
            <div>
              <h3>Ignored users</h3>
              <IgnoredUsers
                users={myIgnoredUsersData.myIgnoredUsers}
                stopIgnoring={stopIgnoringUser}
              />
            </div>
          )
          : null
        }

        <hr />

        <h3>My comments</h3>
        {
          me.comments.length ?
            <CommentHistory
              comments={me.comments}
              asset={asset}
              link={link}
            />
          :
            <p>{lang.t('user_no_comment')}</p>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.toJS(),
  asset: state.asset.toJS(),
  auth: state.auth.toJS()
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({showSignInDialog, checkLogin}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  myCommentHistory,
  myIgnoredUsers,
  stopIgnoringUser,
)(ProfileContainer);

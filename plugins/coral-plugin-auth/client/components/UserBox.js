import React from 'react';
import styles from './styles.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import translations from '../translations';
import I18n from 'coral-framework/modules/i18n/i18n';
import {showSignInDialog, logout} from 'coral-framework/actions/auth';
const lang = new I18n(translations);

const UserBox = ({loggedIn, user, logout, onShowProfile}) => (
  <div>
    {
      loggedIn ? (
        <div className={styles.userBox}>
          {lang.t('signIn.loggedInAs')}
          <a onClick={onShowProfile}>{user.username}</a>. {lang.t('signIn.notYou')}
          <a className={styles.logout} onClick={() => logout()}>
            {lang.t('signIn.logout')}
          </a>
        </div>
      ) : null
    }
  </div>
);

const mapStateToProps = ({auth, user}) => ({
  loggedIn: auth.toJS().loggedIn,
  user: auth.toJS().user
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({logout}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserBox);

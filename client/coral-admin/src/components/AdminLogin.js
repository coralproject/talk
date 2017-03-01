import React, {PropTypes} from 'react';
import Layout from 'coral-admin/src/components/ui/Layout';
import styles from './NotFound.css';
import {Button, TextField, Alert} from 'coral-ui';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations';
const lang = new I18n(translations);

class AdminLogin extends React.Component {

  constructor (props) {
    super(props);
    this.state = {email: '', password: '', requestPassword: false};
  }

  handleSignIn = e => {
    e.preventDefault();
    this.props.handleLogin(this.state.email, this.state.password);
  }

  handleRequestPassword = e => {
    e.preventDefault();
    this.props.requestPasswordReset(this.state.email);
  }

  render () {
    const {errorMessage} = this.props;
    const signInForm = (
      <form onSubmit={this.handleSignIn}>
        {errorMessage && <Alert>{lang.t(`errors.${errorMessage}`)}</Alert>}
        <TextField
          label='email'
          value={this.state.email}
          onChange={e => this.setState({email: e.target.value})} />
        <TextField
          label='password'
          value={this.state.password}
          onChange={e => this.setState({password: e.target.value})}
          type='password' />
        <Button
          type='submit'
          cStyle='black'
          onClick={this.handleSignIn} full>Sign In</Button>
        <p>
          Forgot your password? <a href="#" onClick={e => {
            e.preventDefault();
            this.setState({requestPassword: true});
          }}>Request a new one.</a>
        </p>
      </form>
    );
    const requestPasswordForm = (
      this.props.passwordRequestSuccess
      ? <p className={styles.passwordRequestSuccess}>{this.props.passwordRequestSuccess}</p>
      : <form onSubmit={this.handleRequestPassword}>
        <TextField
          label='email'
          value={this.state.email}
          onChange={e => this.setState({email: e.target.value})} />
        <Button
          type='submit'
          cStyle='black'
          onClick={this.handleRequestPassword}>Reset Password</Button>
      </form>
    );
    return (
      <Layout fixedDrawer restricted={true}>
        <div className={styles.layout}>
          <h1>Permission Required</h1>
          <p>Sign in to interact with your community.</p>
          { this.state.requestPassword ? requestPasswordForm : signInForm }
        </div>
      </Layout>
    );
  }
}

AdminLogin.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  passwordRequestSuccess: PropTypes.string,
  loginError: PropTypes.string
};

export default AdminLogin;

import React, {PropTypes} from 'react';
import Layout from 'coral-admin/src/components/ui/Layout';
import styles from './NotFound.css';
import {Button, TextField} from 'coral-ui';

class AdminLogin extends React.Component {

  constructor (props) {
    super(props);
    this.state = {email: '', password: ''};
  }

  handleSignIn = e => {
    e.preventDefault();
    this.props.handleLogin(this.state.email, this.state.password);
  }

  render () {
    return (
      <Layout fixedDrawer restricted={true}>
        <div className={styles.layout}>
          <h1>Permission Required</h1>
          <p>Sign in to interact with your community.</p>
          <form onSubmit={this.handleSignIn}>
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
          </form>
        </div>
      </Layout>
    );
  }
}

AdminLogin.propTypes = {
  handleLogin: PropTypes.func.isRequired
};

export default AdminLogin;

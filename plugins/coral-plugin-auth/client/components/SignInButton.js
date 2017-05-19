import React from 'react';
import {Button} from 'coral-ui';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showSignInDialog} from 'coral-framework/actions/auth';

class SignInButton extends React.Component {
  render() {
    return (
      <Button id="coralSignInButton" onClick={this.props.showSignInDialog} full>
        Sign in to comment
      </Button>
    );
  }
}

const mapStateToProps = ({auth}) => ({auth});

const mapDispatchToProps = dispatch =>
  bindActionCreators({showSignInDialog}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SignInButton);

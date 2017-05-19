import SignInButton from './components/SignInButton';
import SignInContainer from './components/SignInContainer';

export default {
  slots: {
    stream: [SignInButton],
    login: [SignInContainer]
  }
};
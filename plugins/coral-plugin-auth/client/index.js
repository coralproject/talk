import SignInButton from './components/SignInButton';
import SignInContainer from './components/SignInContainer';
import UserBox from './components/UserBox';
import ChangeUserNameContainer from './components/ChangeUserNameContainer';

export default {
  slots: {
    stream: [UserBox, SignInButton, ChangeUserNameContainer],
    login: [SignInContainer]
  }
};
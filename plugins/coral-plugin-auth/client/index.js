import UserBox from './components/UserBox';
import SignInButton from './components/SignInButton';
import SignInContainer from './components/SignInContainer';
import ChangeUserNameContainer from './components/ChangeUsername';

export default {
  slots: {
    stream: [UserBox, SignInButton, ChangeUserNameContainer],
    login: [SignInContainer]
  }
};
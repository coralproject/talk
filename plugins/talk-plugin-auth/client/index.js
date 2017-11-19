import UserBox from './components/UserBox';
import SignInButton from './components/SignInButton';
import SignInAsAnonymousButton from './components/SignInAsAnonymousButton';
import SignInContainer from './components/SignInContainer';
import ChangeUserNameContainer from './components/ChangeUsername';
import translations from './translations.yml';

export default {
  translations,
  slots: {
    stream: [UserBox, SignInButton, SignInAsAnonymousButton, ChangeUserNameContainer],
    login: [SignInContainer]
  }
};


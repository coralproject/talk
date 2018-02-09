import UserBox from './stream/containers/UserBox';
import SignInButton from './stream/containers/SignInButton';
import translations from './translations.yml';
import Login from './login/containers/Main';

export default {
  translations,
  slots: {
    stream: [UserBox, SignInButton],
    login: [Login],
  },
};

import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import translations from './translations.yml';

export default {
  translations,
  slots: {
    authExternalSignIn: [SignIn],
    authExternalSignUp: [SignUp],
  },
};

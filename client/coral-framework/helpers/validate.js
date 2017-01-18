export default {
  email: email => (/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(email)),
  password: pass => !(/^(?=.{8,}).*$/.test(pass)),
  confirmPassword: () => true,
  displayName: displayName => (/^[a-zA-Z0-9_]+$/.test(displayName))
};

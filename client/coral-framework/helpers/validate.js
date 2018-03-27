const email = str => /^.+@.+\..+$/.test(str);

const validate = {
  email,
  password: pass => /^(?=.{8,}).*$/.test(pass),
  confirmPassword: () => true,
  username: username => /^[a-zA-Z0-9_]+$/.test(username),
  organizationName: org => /^[a-zA-Z0-9_ ]+$/.test(org),
  organizationEmail: email,
};

export default validate;

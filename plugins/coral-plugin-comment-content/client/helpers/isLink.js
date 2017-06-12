const linkRE = /(((http|ftp|https)\:\/\/)?([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?)/gmi;

const isLink = (s) => linkRE.test(s);

export default isLink;

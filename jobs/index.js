const jobs = [require('./mailer')];

const process = () => jobs.forEach(job => job());

module.exports = { process };

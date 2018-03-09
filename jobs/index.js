const jobs = [require('./mailer'), require('./scraper')];

const process = () => jobs.forEach(job => job());

module.exports = { process };

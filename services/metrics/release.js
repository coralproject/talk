const client = require('prom-client');

const releaseVersion = new client.Gauge({
  name: 'comments_release_version',
  help: 'Release version',
  labelNames: ['commit_hash']
});

function trackRelease(last_commit_hash) {
  if (!process.env.BUILD_NUMBER) {
    console.log('ERROR: BUILD_NUMBER is undefined!');
    return;
  }
  console.log('last_commit_hash', last_commit_hash)
  releaseVersion.set({commit_hash: last_commit_hash}, Number(process.env.BUILD_NUMBER));
}

module.exports = trackRelease;

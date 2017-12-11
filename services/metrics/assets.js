const client = require('prom-client');

const assetsTotalCount = new client.Gauge({
  name: 'comments_assets_total_count',
  help: 'Assets total count'
});

module.exports = {
  assetsTotalCount
};

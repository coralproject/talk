// Make things colorful!
require('colors');

const Table = require('cli-table2');

function getLevelColorized(level) {
  switch (level) {
    case 'WARNING':
      return level.yellow;
    case 'SEVERE':
      return level.red;
    default:
      return level;
  }
}

function printBrowserLog(client) {
  return new Promise(resolve => {
    client.getLog('browser', entries => {
      if (entries.length) {
        let table = new Table({
          head: ['Level'.cyan, 'Message'.cyan],
          wordWrap: true,
          colWidths: [10, 80],
        });

        for (let entry of entries) {
          table.push([getLevelColorized(entry.level), entry.message]);
        }
        console.log(table.toString());
      }
      resolve();
    });
  });
}

module.exports = printBrowserLog;

const {readFileSync} = require('fs');
const path = require('path');

module.exports = {
  tags: [
    {
      name: 'OFF_TOPIC',
      permissions: {
        public: true,
        self: true,
        roles: []
      },
      models: ['COMMENTS'],
      created_at: new Date()
    }
  ]
};

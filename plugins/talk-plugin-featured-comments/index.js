module.exports = {
  tags: [
    {
      name: 'FEATURED',
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

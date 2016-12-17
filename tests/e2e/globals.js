export default {
  waitForConditionTimeout: 20000,
  baseUrl: 'http://localhost:3000',
  testUser: {
    user: process.env.CORAL_TEST_USER,
    pass: process.env.CORAL_TEST_PASS
  }
};

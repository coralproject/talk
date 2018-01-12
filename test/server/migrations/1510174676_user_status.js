const migration = require('../../../migrations/1510174676_user_status');
const UserModel = require('../../../models/user');

const chai = require('chai');
chai.use(require('chai-datetime'));
const { expect } = chai;

describe('migration.1510174676_user_status', () => {
  describe('active user', () => {
    beforeEach(async () => {
      await UserModel.collection.insert({
        id: '123',
        username: 'Kirk',
        lowercaseUsername: 'kirk',
        status: 'ACTIVE',
        canEditName: false,
      });
    });

    it('completes the migration', async () => {
      let user = await UserModel.collection.findOne({ id: '123' });

      expect(user).to.have.property('status', 'ACTIVE');
      expect(user).to.have.property('canEditName', false);

      // Perform the migration.
      await migration.up();

      user = await UserModel.collection.findOne({ id: '123' });

      // Check that it was correct.
      expect(user).to.have.property('status');
      expect(user.status).to.have.property('username');
      expect(user.status.username).to.have.property('status', 'SET');
      expect(user.status.username.history).to.have.length(1);
    });
  });

  describe('social user', () => {
    beforeEach(async () => {
      await UserModel.collection.insert({
        id: '123',
        username: 'Kirk',
        lowercaseUsername: 'kirk',
        status: 'ACTIVE',
        canEditName: true,
      });
    });

    it('completes the migration', async () => {
      let user = await UserModel.collection.findOne({ id: '123' });

      expect(user).to.have.property('status', 'ACTIVE');
      expect(user).to.have.property('canEditName', true);

      // Perform the migration.
      await migration.up();

      user = await UserModel.collection.findOne({ id: '123' });

      // Check that it was correct.
      expect(user).to.have.property('status');
      expect(user.status).to.have.property('username');
      expect(user.status.username).to.have.property('status', 'UNSET');
      expect(user.status.username.history).to.have.length(1);
    });
  });

  describe('rejected username', () => {
    beforeEach(async () => {
      await UserModel.collection.insert({
        id: '123',
        username: 'Kirk',
        lowercaseUsername: 'kirk',
        status: 'BANNED',
        canEditName: true,
      });
    });

    it('completes the migration', async () => {
      let user = await UserModel.collection.findOne({ id: '123' });

      expect(user).to.have.property('status');
      expect(user.status).to.equal('BANNED');
      expect(user.canEditName).to.equal(true);

      // Perform the migration.
      await migration.up();

      user = await UserModel.collection.findOne({ id: '123' });

      // Check that it was correct.
      expect(user).to.have.property('status');
      expect(user.status).to.have.property('banned');
      expect(user.status.banned).to.have.property('status', false);
      expect(user.status.username).to.have.property('status', 'REJECTED');
      expect(user.status.username.history).to.have.length(1);
    });
  });

  describe('approved username', () => {
    beforeEach(async () => {
      await UserModel.collection.insert({
        id: '123',
        username: 'Kirk',
        lowercaseUsername: 'kirk',
        status: 'APPROVED',
        canEditName: false,
      });
    });

    it('completes the migration', async () => {
      let user = await UserModel.collection.findOne({ id: '123' });

      expect(user).to.have.property('status');
      expect(user.status).to.equal('APPROVED');
      expect(user.canEditName).to.equal(false);

      // Perform the migration.
      await migration.up();

      user = await UserModel.collection.findOne({ id: '123' });

      // Check that it was correct.
      expect(user).to.have.property('status');
      expect(user.status).to.have.property('banned');
      expect(user.status.banned).to.have.property('status', false);
      expect(user.status.username).to.have.property('status', 'APPROVED');
      expect(user.status.username.history).to.have.length(1);
    });
  });

  describe('suspended user', () => {
    beforeEach(async () => {
      await UserModel.collection.insert({
        id: '123',
        username: 'Kirk',
        lowercaseUsername: 'kirk',
        status: 'ACTIVE',
        suspension: {
          until: new Date(),
        },
      });
    });

    it('completes the migration', async () => {
      let user = await UserModel.collection.findOne({ id: '123' });

      expect(user).to.have.property('suspension');
      expect(user.suspension).to.have.property('until');
      expect(user.suspension.until).to.not.be.null;

      const until = user.suspension.until;

      // Perform the migration.
      await migration.up();

      user = await UserModel.collection.findOne({ id: '123' });

      // Check that it was correct.
      expect(user).to.have.property('status');
      expect(user.status).to.have.property('suspension');
      expect(user.status.suspension).to.have.property('until');
      expect(user.status.suspension.until).to.not.be.null;
      expect(user.status.suspension.until).to.be.withinTime(
        new Date(until.getTime() - 1000),
        new Date(until.getTime() + 1000)
      );
    });
  });

  describe('banned user', () => {
    beforeEach(async () => {
      await UserModel.collection.insert({
        id: '123',
        username: 'Kirk',
        lowercaseUsername: 'kirk',
        status: 'BANNED',
        canEditName: false,
      });
    });

    it('completes the migration', async () => {
      let user = await UserModel.collection.findOne({ id: '123' });

      expect(user).to.have.property('status');
      expect(user.status).to.equal('BANNED');

      // Perform the migration.
      await migration.up();

      user = await UserModel.collection.findOne({ id: '123' });

      // Check that it was correct.
      expect(user).to.have.property('status');
      expect(user.status).to.have.property('banned');
      expect(user.status.banned).to.have.property('status', true);
    });
  });
});

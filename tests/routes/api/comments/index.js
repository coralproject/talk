require('../../../utils/mongoose');

const Action = require('../../../../models/action');
const User = require('../../../../models/user');

describe('Post a Comment: /comments', () => {
  const users = [{
    id: '123',
    display_name: 'John',
  },{
    id: '456',
    display_name: 'Paul',
  }]

  const actions = [{
    action_type: 'flag',
    item_id: 'abc'
  },{
    action_type: 'like',
    item_id: 'hij'
  }]

  beforeEach(() => {
    return User.create(users).then(() => {
      return Action.create(actions)
    })
  })

  it('it should create a comment')

})

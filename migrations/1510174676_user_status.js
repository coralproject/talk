const UserModel = require('../models/user');
const merge = require('lodash/merge');

const getUserBatch = async () => {
  let query = {
    status: {
      $in: ['ACTIVE', 'BANNED', 'PENDING', 'APPROVED'],
    },
  };

  // Find all the users that need migrating.
  return UserModel.collection.find(query);
};

module.exports = {
  async up() {
    const created_at = Date.now();

    // Get the first batch of users.
    let cursor = await getUserBatch();

    const updates = [];
    while (await cursor.hasNext()) {
      const user = await cursor.next();

      const { id, status, canEditName, suspension, disabled } = user;

      let update = {
        $unset: {
          canEditName: '',
          suspension: '',
          disabled: '',
        },
        $set: {
          status: {
            // The username status is specific to each case.
            username: {
              history: [],
            },

            // The user is not banned by default.
            banned: {
              status: false,
              history: [],
            },

            // The user is not suspended by default.
            suspension: {
              until: null,
              history: [],
            },
          },
          updated_at: created_at,
        },
      };

      if (disabled) {
        update = merge(update, {
          $set: {
            status: {
              banned: {
                status: true,
                history: [
                  {
                    status: true,
                    created_at,
                  },
                ],
              },
            },
          },
        });
      }

      // If the user has an "until" property of their suspension, then we need
      // to reflect that in the new status object.
      if (suspension && suspension.until !== null) {
        update = merge(update, {
          $set: {
            status: {
              suspension: {
                until: suspension.until,
                history: [
                  {
                    until: suspension.until,
                    created_at,
                  },
                ],
              },
            },
          },
        });
      }

      switch (status) {
        case 'ACTIVE':
          if (canEditName) {
            update = merge(update, {
              $set: {
                status: {
                  username: {
                    status: 'UNSET',
                    history: [
                      {
                        status: 'UNSET',
                        created_at,
                      },
                    ],
                  },
                },
              },
            });
          } else {
            update = merge(update, {
              $set: {
                status: {
                  username: {
                    status: 'SET',
                    history: [
                      {
                        status: 'SET',
                        created_at,
                      },
                    ],
                  },
                },
              },
            });
          }
          break;
        case 'BANNED':
          if (canEditName) {
            update = merge(update, {
              $set: {
                status: {
                  username: {
                    status: 'REJECTED',
                    history: [
                      {
                        status: 'REJECTED',
                        created_at,
                      },
                    ],
                  },
                },
              },
            });
          } else {
            update = merge(update, {
              $set: {
                status: {
                  banned: {
                    status: true,
                    history: [
                      {
                        status: true,
                        created_at,
                      },
                    ],
                  },
                  username: {
                    status: 'SET',
                    history: [
                      {
                        status: 'SET',
                        created_at,
                      },
                    ],
                  },
                },
              },
            });
          }
          break;
        case 'PENDING':
          update = merge(update, {
            $set: {
              status: {
                username: {
                  status: 'CHANGED',
                  history: [
                    {
                      status: 'CHANGED',
                      created_at,
                    },
                  ],
                },
              },
            },
          });
          break;
        case 'APPROVED':
          update = merge(update, {
            $set: {
              status: {
                username: {
                  status: 'APPROVED',
                  history: [
                    {
                      status: 'APPROVED',
                      created_at,
                    },
                  ],
                },
              },
            },
          });
          break;
        default:
          throw new Error(`${status} is an invalid status`);
      }

      updates.push({ query: { id }, update });
    }

    if (updates.length > 0) {
      // Create a new batch operation.
      let bulk = UserModel.collection.initializeUnorderedBulkOp();

      for (const { query, update } of updates) {
        bulk.find(query).updateOne(update);
      }

      // Execute the bulk update operation.
      await bulk.execute();
    }
  },
};

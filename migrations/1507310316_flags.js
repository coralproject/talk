const ActionModel = require('../models/action');

const mapping = {
  COMMENTS: {
    'Comment contains toxic language': 'TOXIC_COMMENT',
    'Matched suspect word filter': 'SUSPECT_WORD',
    other: 'COMMENT_OTHER',
    Other: 'COMMENT_OTHER',
    'This looks like an ad/marketing': 'COMMENT_SPAM',
    'This comment is offensive': 'COMMENT_OFFENSIVE',
  },
};

module.exports = {
  async up({ processManyUpdates }) {
    const updates = [];
    for (const item_type in mapping) {
      const mappings = mapping[item_type];

      for (const OLD_GROUP_ID in mappings) {
        const NEW_GROUP_ID = mappings[OLD_GROUP_ID];

        // OLD
        // {
        //   group_id: <OLD_GROUP_ID>
        // }
        // NEW
        // {
        //   group_id: <NEW_GROUP_ID>
        // }

        updates.push({
          query: {
            group_id: OLD_GROUP_ID,
            item_type,
          },
          update: {
            $set: {
              group_id: NEW_GROUP_ID,
            },
          },
        });
      }
    }

    if (updates.length > 0) {
      await processManyUpdates(ActionModel, updates);
    }
  },
};

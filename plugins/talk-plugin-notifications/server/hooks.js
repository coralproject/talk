const { isValidJSValue } = require('graphql');

module.exports = {
  NotificationSettings: {
    digestFrequency: {
      // This hook will swap out the digest frequency with `NONE` in the event
      // that an org had a digest plugin enabled and later switched it off. This
      // will force users that have previously had a digested option enabled to
      // get notifications immediately until they update their frequency
      // options.
      post: async (settings, args, ctx, { schema }, frequency) => {
        try {
          // Validate that the type is correct.
          const errors = isValidJSValue(
            frequency,
            schema.getType('DIGEST_FREQUENCY')
          );
          if (errors && errors.length > 0) {
            ctx.log.info(
              { frequency },
              'invalid frequency, swapping with `NONE`, plugin likely disabled'
            );
            // Fallback to 'NONE' if the digest value has an error.
            frequency = 'NONE';
          }
        } catch (err) {
          ctx.log.error({ err }, 'could not check if the type was valid');

          // Fallback to 'NONE' if we couldn't validate the value.
          frequency = 'NONE';
        }

        return frequency;
      },
    },
  },
};

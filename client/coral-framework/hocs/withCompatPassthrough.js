import withProps from 'recompose/withProps';
import omit from 'lodash/omit';

function getPassthrough(props, omitProps) {
  const slotProps = omit(props, [...omitProps, 'passthrough']);

  // @Deprecated
  if (process.env.NODE_ENV !== 'production') {
    if (Object.keys(slotProps).length) {
      /* eslint-disable no-console */
      console.warn(
        `Slot '${
          props.fill
        }' passing through unknown props is deprecated, please use 'passthrough' instead`,
        slotProps
      );
      /* eslint-enable no-console */
    }
  }

  if (props.passthrough) {
    return props.passthrough;
  }

  if (props.queryData) {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint-disable no-console */
      console.warn(
        `Slot '${
          props.fill
        }' property 'queryData' is deprecated, please use 'passthrough' instead`
      );
      /* eslint-enable no-console */
    }
    return {
      ...props.queryData,
      ...slotProps,
    };
  }

  return slotProps;
}

/**
 * @Deprecated
 * withCompatPassthrough is a compatibility HOC that supports our old
 * API which puts unknown props and `queryData` to `passhtrough` to be
 * used with HOC `withSlotElements`.
 */
export default omitProps =>
  withProps(props => ({
    passthrough: getPassthrough(props, omitProps),
  }));

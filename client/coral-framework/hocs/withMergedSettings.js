import { mergeExcludingArrays } from 'coral-framework/utils';
import assignWith from 'lodash/assignWith';
import get from 'lodash/get';
import { withPropsOnChange } from 'recompose';

/**
 * Exports a HOC that applies props at `pending` to
 * props at `settings` and writes into `result` prop name.
 * `Settings`, and `pending` can have a dotnotation like
 * "asset.settings".
 *
 * Example:
 * withMergedSettings('asset.settings', 'pending', 'mergedSettings')
 */
const withMergedSettings = (settings, pending, result) =>
  withPropsOnChange(
    (props, nextProps) =>
      get(props, settings) !== get(nextProps, settings) ||
      get(props, pending) !== get(nextProps, pending),
    props => ({
      [result]: assignWith(
        {},
        get(props, settings),
        get(props, pending),
        mergeExcludingArrays
      ),
    })
  );

export default withMergedSettings;

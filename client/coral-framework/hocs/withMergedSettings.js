import {mergeExcludingArrays} from 'coral-framework/utils';
import assignWith from 'lodash/assignWith';
import get from 'lodash/get';
import {withPropsOnChange} from 'recompose';

const withMergedSettings = (settings, pending, result) =>
  withPropsOnChange(
    (props, nextProps) =>
      get(props, settings) !== get(nextProps, settings) ||
      get(props, pending) !== get(nextProps, pending),
    (props) => ({
      [result]: assignWith({}, get(props, settings), get(props, pending), mergeExcludingArrays)
    })
  );

export default withMergedSettings;

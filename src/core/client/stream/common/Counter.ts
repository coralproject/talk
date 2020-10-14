import cn from "classnames";
import { withProps } from "recompose";

import CLASSES from "coral-stream/classes";
import { Counter } from "coral-ui/components/v2";
import { PropTypesOf } from "coral-ui/types";

/**
 * Like <Counter /> from coral ui but with a stable css classname.
 */
export default withProps<
  Partial<PropTypesOf<typeof Counter>>,
  PropTypesOf<typeof Counter>
>(({ className }) => ({
  className: cn(className, CLASSES.counter),
}))(Counter);

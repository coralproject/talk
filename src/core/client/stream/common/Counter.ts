import cn from "classnames";
import { withProps } from "recompose";

import CLASSES from "coral-stream/classes";
import { Counter } from "coral-ui/components";
import { PropTypesOf } from "coral-ui/types";

export default withProps<
  PropTypesOf<typeof Counter>,
  PropTypesOf<typeof Counter>
>(({ className }) => ({
  className: cn(className, CLASSES.counter),
}))(Counter);

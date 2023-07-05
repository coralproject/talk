import cn from "classnames";
import { withProps } from "recompose";

import CLASSES from "coral-stream/classes";
import { Spinner } from "coral-ui/components/v2";
import { PropTypesOf } from "coral-ui/types";

/**
 * Like <Spinner /> from coral ui but with a stable css classname.
 */
export default withProps<
  Partial<PropTypesOf<typeof Spinner>>,
  PropTypesOf<typeof Spinner>
>(({ className }) => ({
  className: cn(className, CLASSES.spinner),
}))(Spinner);

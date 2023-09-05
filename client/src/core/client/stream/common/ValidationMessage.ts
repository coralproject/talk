import cn from "classnames";
import { withProps } from "recompose";

import CLASSES from "coral-stream/classes";
import { ValidationMessage } from "coral-ui/components/v3";
import { PropTypesOf } from "coral-ui/types";

/**
 * Like <ValidationMessage /> from coral ui but with a stable css classname.
 */
export default withProps<
  Partial<PropTypesOf<typeof ValidationMessage>>,
  PropTypesOf<typeof ValidationMessage>
>(({ className }) => ({
  className: cn(className, CLASSES.validationMessage),
}))(ValidationMessage);

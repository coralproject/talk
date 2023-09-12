import cn from "classnames";
import { withProps } from "recompose";

import { ValidationMessage } from "coral-framework/lib/form";
import CLASSES from "coral-stream/classes";
import { PropTypesOf } from "coral-ui/types";

/**
 * Like <ValidationMessage /> from the form library but with a stable css classname.
 */
export default withProps<
  Partial<PropTypesOf<typeof ValidationMessage>>,
  PropTypesOf<typeof ValidationMessage>
>(({ className }) => ({
  className: cn(className, CLASSES.validationMessage),
}))(ValidationMessage);

import {
  DefaultingInferableComponentEnhancer,
  withPropsOnChange,
} from "recompose";

/**
 * withStyles provides a property `classes: object` that
 * includes the classNames from `styles` and extensions from the
 * property `classes`.
 */
function withStyles<T>(
  styles: T
): DefaultingInferableComponentEnhancer<{ classes?: Partial<T> }> {
  return withPropsOnChange<any, any>(["classes"], (props) => {
    const result = { ...styles };
    if (props.classes) {
      Object.keys(props.classes).forEach((k) => {
        if ((styles as any)[k]) {
          (result as any)[k] += ` ${props.classes[k]}`;
        }
      });
    }
    return { classes: result };
  });
}

export default withStyles;

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
  const classes = { ...(styles as any) };
  return withPropsOnChange<any, any>(["classes"], props => {
    const resolvedClasses = { ...classes };
    if (props.classes) {
      Object.keys(props.classes).forEach(k => {
        if (classes[k]) {
          resolvedClasses[k] += ` ${props.classes[k]}`;
        } else if (process.env.NODE_ENV === "test") {
          throw new Error(`Extending non existent className ${k}`);
        } else if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.warn("Extending non existent className", k);
        }
      });
    }
    return { classes: resolvedClasses };
  });
}

export default withStyles;

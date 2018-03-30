import { withPropsOnChange } from 'recompose';

/**
 * withStyles provides a property `classes: object` that
 * includes the classNames from `styles` and extensions from the
 * property `classes`.
 */
export default function withStyles(styles) {
  const classes = { ...styles };
  return withPropsOnChange(['classes'], props => {
    if (props.classes) {
      Object.keys(props.classes).forEach(k => {
        if (classes[k]) {
          classes[k] += ` ${props.classes[k]}`;
        } else if (process.env.NODE_ENV !== 'production') {
          console.warn('Extending non existant className', k);
        }
      });
    }
    return { classes };
  });
}

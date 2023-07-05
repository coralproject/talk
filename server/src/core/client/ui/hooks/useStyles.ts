/**
 * useStyles returns css classes with `styles` that are extendend by `classes`.
 * Only keys are taken into account that are also avaiable in `styles`.
 *
 * Usage:
 * ```ts
 * import styles from "./Button.css";
 * ...
 * const css = useStyles(styles, classes);
 * return (
 *  <div className={css.root}></div>
 * );
 * ```
 */
export default function useStyles<T>(styles: T, classes?: Partial<T>): T {
  const result = { ...styles };
  if (classes) {
    Object.keys(classes).forEach((k) => {
      if ((styles as any)[k]) {
        (result as any)[k] += ` ${(classes as any)[k]}`;
      }
    });
  }
  return result;
}

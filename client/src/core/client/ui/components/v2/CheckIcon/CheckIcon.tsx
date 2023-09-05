import cn from "classnames";
import React, { FunctionComponent } from "react";

import { withStyles } from "coral-ui/hocs";

import styles from "./CheckIcon.css";

interface Props {
  className?: string;
  classes: typeof styles;
}

const CheckIcon: FunctionComponent<Props> = ({
  className,
  classes,
  ...rest
}) => (
  <svg
    {...rest}
    className={cn(classes.base, className)}
    width="62"
    height="62"
    viewBox="0 0 62 62"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9 9.125C15.0833 3.04167 22.4167 0 31 0C39.5833 0 46.875 3.04167 52.875 9.125C58.9583 15.125 62 22.4167 62 31C62 39.5833 58.9583 46.9167 52.875 53C46.875 59 39.5833 62 31 62C22.4167 62 15.0833 59 9 53C3 46.9167 0 39.5833 0 31C0 22.4167 3 15.125 9 9.125ZM48.625 13.375C43.7917 8.45833 37.9167 6 31 6C24.0833 6 18.1667 8.45833 13.25 13.375C8.41667 18.2083 6 24.0833 6 31C6 37.9167 8.41667 43.8333 13.25 48.75C18.1667 53.5833 24.0833 56 31 56C37.9167 56 43.7917 53.5833 48.625 48.75C53.5417 43.8333 56 37.9167 56 31C56 24.0833 53.5417 18.2083 48.625 13.375ZM48.5 22.25C49.25 23 49.25 23.7083 48.5 24.375L27 45.75C26.25 46.5 25.5417 46.5 24.875 45.75L13.5 34.375C12.75 33.625 12.75 32.9167 13.5 32.25L16.375 29.375C17.0417 28.7083 17.75 28.7083 18.5 29.375L25.875 37L43.625 19.375C44.2917 18.7083 45 18.75 45.75 19.5L48.5 22.25Z" />
  </svg>
);

export default withStyles(styles)(CheckIcon);

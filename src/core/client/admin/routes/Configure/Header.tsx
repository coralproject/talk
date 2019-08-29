import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Typography } from "coral-ui/components";
import { PropTypesOf } from "coral-ui/types";

import styles from "./Header.css";

type Props = PropTypesOf<typeof Typography>;

const Header: FunctionComponent<Props> = ({ children, className, ...rest }) => (
  <Typography
    variant="heading3"
    className={cn(className, styles.root)}
    {...rest}
  >
    {children}
  </Typography>
);

export default Header;

import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Typography } from "talk-ui/components";
import { PropTypesOf } from "talk-ui/types";

import styles from "./Header.css";

type Props = PropTypesOf<typeof Typography>;

const Header: FunctionComponent<Props> = ({ children, className, ...rest }) => (
  <Typography
    variant="heading1"
    className={cn(className, styles.root)}
    {...rest}
  >
    {children}
  </Typography>
);

export default Header;

import cn from "classnames";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { Card } from "coral-ui/components/v2";

import styles from "./EmptyMessage.css";

type Props = PropTypesOf<typeof Card>;

const EmptyMessage: FunctionComponent<Props> = (props) => (
  <Card {...props} className={cn(props.className, styles.root)} />
);

export default EmptyMessage;

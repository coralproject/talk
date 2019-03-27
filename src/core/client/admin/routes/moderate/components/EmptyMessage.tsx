import cn from "classnames";
import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { Card } from "talk-ui/components";

import styles from "./EmptyMessage.css";

interface Props extends PropTypesOf<typeof Card> {}

const EmptyMessage: StatelessComponent<Props> = props => (
  <Card {...props} className={cn(props.className, styles.root)} />
);

export default EmptyMessage;

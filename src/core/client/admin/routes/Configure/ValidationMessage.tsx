import React, { FunctionComponent } from "react";

import { ValidationMessage as FrameworkValidationMessage } from "coral-framework/lib/form";
import { PropTypesOf } from "coral-ui/types";

import styles from "./ValidationMessage.css";

type Props = PropTypesOf<typeof FrameworkValidationMessage>;

const ValidationMessage: FunctionComponent<Props> = props => (
  <FrameworkValidationMessage className={styles.root} {...props} />
);

export default ValidationMessage;

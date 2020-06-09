import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { HorizontalGutter } from "coral-ui/components/v2";

import styles from "./NotFound.css";

const NotFound: FunctionComponent = () => (
  <HorizontalGutter container="main">
    <Localized id="notFound">
      <div className={styles.content}>Not Found</div>
    </Localized>
  </HorizontalGutter>
);

export default NotFound;

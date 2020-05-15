import React, { FunctionComponent } from "react";

import { Flex, Spinner } from "coral-ui/components/v2";

import styles from "./Loader.css";

interface Props {
  loading: boolean;
}

const Loader: FunctionComponent<Props> = ({ loading }) => {
  if (!loading) {
    return null;
  }
  return (
    <Flex justifyContent="center" alignItems="center" className={styles.root}>
      <Spinner />
    </Flex>
  );
};

export default Loader;

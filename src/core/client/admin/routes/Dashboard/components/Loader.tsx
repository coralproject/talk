import React, { FunctionComponent } from "react";

import { Flex, Spinner } from "coral-ui/components/v2";

import styles from "./Loader.css";

interface Props {
  loading: boolean;
  height?: number;
}

const Loader: FunctionComponent<Props> = ({ loading, height }) => {
  if (!loading) {
    return null;
  }
  return (
    <Flex
      style={height ? { height } : {}}
      justifyContent="center"
      alignItems="center"
      className={styles.root}
    >
      <Spinner />
    </Flex>
  );
};

export default Loader;

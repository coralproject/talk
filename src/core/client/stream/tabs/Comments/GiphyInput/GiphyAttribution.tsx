import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { Flex } from "coral-ui/components/v2";

import giphyAttributionImg from "./giphyAttribution.png";

import styles from "./GiphyAttribution.css";

const GiphyAttribution: FunctionComponent = () => {
  return (
    <Flex justifyContent="flex-end">
      <Localized
        id="comments-postComment-gifSearch-powered-by-giphy"
        attrs={{ alt: true }}
      >
        <img
          className={styles.img}
          src={giphyAttributionImg}
          alt="powered by giphy"
        />
      </Localized>
    </Flex>
  );
};

export default GiphyAttribution;

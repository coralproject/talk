import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { Flex } from "coral-ui/components/v2";

import giphyAttributionImg from "./tenorAttribution.png";

import styles from "./TenorAttribution.css";

const TenorAttribution: FunctionComponent = () => {
  return (
    <Flex justifyContent="flex-end">
      <Localized
        id="comments-postComment-gifSearch-powered-by-giphy"
        attrs={{ alt: true }}
      >
        <img
          className={styles.img}
          src={giphyAttributionImg}
          alt="powered by Tenor"
        />
      </Localized>
    </Flex>
  );
};

export default TenorAttribution;

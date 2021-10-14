import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { Card, Flex, Spinner } from "coral-ui/components/v2";

import styles from "./SiteSearchList.css";
import AutoLoadMore from "../AutoLoadMore";
import { PropTypesOf } from "coral-framework/types";
import SiteFilterOption from "./SiteFilterOption";

interface Props {
  isVisible: boolean;
  sites: Array<{ id: string } & PropTypesOf<typeof SiteFilterOption>["site"]>;
  hasMore: boolean;
  loading: boolean;
  disableLoadMore: boolean;
  onLoadMore: () => void;
}

const SiteSearchList: FunctionComponent<Props> = ({
  isVisible,
  sites,
  loading,
  hasMore,
  disableLoadMore,
  onLoadMore,
  children,
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <Card className={styles.list}>
      {children}
      {!loading && sites.length === 0 && (
        <div className={styles.noneFound}>
          <Localized id="site-search-none-found">
            No sites were found with that search
          </Localized>
        </div>
      )}
      {loading && (
        <Flex justifyContent="center">
          <Spinner />
        </Flex>
      )}
      {hasMore && (
        <Flex justifyContent="center">
          <AutoLoadMore
            disableLoadMore={disableLoadMore}
            onLoadMore={onLoadMore}
          />
        </Flex>
      )}
    </Card>
  );
};

export default SiteSearchList;

import React, { FunctionComponent } from "react";

import AutoLoadMore from "coral-admin/components/AutoLoadMore";
import { PropTypesOf } from "coral-framework/types";
import { Flex, Spinner } from "coral-ui/components/v2";

import DashboardSiteContainer from "./DashboardSiteContainer";

interface Props {
  sites: ReadonlyArray<
    { id: string } & PropTypesOf<typeof DashboardSiteContainer>["site"]
  >;
  onLoadMore: () => void;
  hasMore: boolean;
  disableLoadMore: boolean;
  loading: boolean;
}

const SitesTable: FunctionComponent<Props> = (props) => {
  return (
    <>
      {props.sites.map((site) => (
        <DashboardSiteContainer site={site} key={site.id} />
      ))}
      {props.loading && (
        <Flex justifyContent="center">
          <Spinner />
        </Flex>
      )}
      {props.hasMore && (
        <Flex justifyContent="center">
          <AutoLoadMore
            disableLoadMore={props.disableLoadMore}
            onLoadMore={props.onLoadMore}
          />
        </Flex>
      )}
    </>
  );
};

export default SitesTable;

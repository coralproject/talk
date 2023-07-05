import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import AutoLoadMore from "coral-admin/components/AutoLoadMore";
import { PropTypesOf } from "coral-framework/types";
import {
  Flex,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "coral-ui/components/v2";

import EmptySitesMessage from "./EmptySitesMessage";
import SiteRowContainer from "./SiteRowContainer";

interface Props {
  sites: Array<{ id: string } & PropTypesOf<typeof SiteRowContainer>["site"]>;
  onLoadMore: () => void;
  hasMore: boolean;
  disableLoadMore: boolean;
  loading: boolean;
}

const SitesTable: FunctionComponent<Props> = (props) => {
  return (
    <>
      <Table fullWidth>
        <TableHead>
          <TableRow>
            <Localized id="site-table-siteName">
              <TableCell>Site name</TableCell>
            </Localized>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {props.sites.map((site) => (
            <SiteRowContainer site={site} key={site.id} />
          ))}
        </TableBody>
      </Table>
      {!props.loading && props.sites.length === 0 && <EmptySitesMessage />}
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

import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { Button, FormFieldDescription, Icon } from "coral-ui/components/v2";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "coral-ui/components/v2/Table";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import SiteRowContainer from "./SiteRowContainer";

interface Props {
  sites: Array<{ id: string } & PropTypesOf<typeof SiteRowContainer>["site"]>;
  onLoadMore: () => void;
  hasMore: boolean;
  disableLoadMore: boolean;
  loading: boolean;
}

const SitesConfig: FunctionComponent<Props> = ({ sites }) => {
  return (
    <ConfigBox
      title={
        <Localized id="configure-organization-sites">
          <Header htmlFor="configure-organization-organization.sites">
            Sites
          </Header>
        </Localized>
      }
    >
      <Localized id="configure-organization-sites-explanation">
        <FormFieldDescription>
          Add a new site to your organization or edit an existing site's
          details.
        </FormFieldDescription>
      </Localized>
      <Localized
        id="configure-organization-sites-add-site"
        icon={<Icon>add</Icon>}
      >
        <Button
          to="/admin/configure/organization/sites/new"
          iconLeft
          size="large"
        >
          <Icon>add</Icon>
          Add a site
        </Button>
      </Localized>
      <Table fullWidth>
        <TableHead>
          <TableRow>
            <TableCell>Site name</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {sites.map(site => (
            <SiteRowContainer site={site} key={site.id} />
          ))}
        </TableBody>
      </Table>
    </ConfigBox>
  );
};

export default SitesConfig;

import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { ArrowRightIcon, SvgIcon } from "coral-ui/components/icons";
import { Button, Flex } from "coral-ui/components/v2";
import { TableCell, TableRow } from "coral-ui/components/v2/Table";

import { SiteRowContainer_site } from "coral-admin/__generated__/SiteRowContainer_site.graphql";

import styles from "./SiteRowContainer.css";

interface Props {
  site: SiteRowContainer_site;
}

const SiteRowContainer: FunctionComponent<Props> = ({ site }) => {
  return (
    <TableRow>
      <TableCell>{site.name}</TableCell>
      <TableCell>
        <Flex justifyContent="flex-end">
          <Localized
            id="configure-sites-site-details"
            elems={{
              icon: (
                <SvgIcon
                  Icon={ArrowRightIcon}
                  size="xxs"
                  className={styles.detailsIcon}
                />
              ),
            }}
          >
            <Button
              variant="text"
              to={`/admin/configure/organization/sites/${site.id}`}
              iconRight
            >
              Details
              <SvgIcon
                Icon={ArrowRightIcon}
                size="xxs"
                className={styles.detailsIcon}
              />
            </Button>
          </Localized>
        </Flex>
      </TableCell>
    </TableRow>
  );
};

const enhanced = withFragmentContainer<Props>({
  site: graphql`
    fragment SiteRowContainer_site on Site {
      id
      name
      createdAt
    }
  `,
})(SiteRowContainer);

export default enhanced;

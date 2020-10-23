import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { useField } from "react-final-form";

import AutoLoadMore from "coral-admin/components/AutoLoadMore";
import {
  CheckBox,
  FieldSet,
  Flex,
  FormField,
  Label,
  ListGroup,
  ListGroupRow,
  Spinner,
} from "coral-ui/components/v2";

import styles from "./SiteModeratorModalSiteField.css";

interface Props {
  sites: Array<{ id: string; name: string }>;
  onLoadMore: () => void;
  hasMore: boolean;
  disableLoadMore: boolean;
  loading: boolean;
}

const SiteModeratorModalSiteField: FunctionComponent<Props> = ({
  sites,
  onLoadMore,
  hasMore,
  disableLoadMore,
  loading,
}) => {
  const { input } = useField<string[]>("siteIDs");
  const onChange = useCallback(
    (siteID: string, selectedIndex: number) => () => {
      const changed = [...input.value];
      if (selectedIndex >= 0) {
        changed.splice(selectedIndex, 1);
      } else {
        changed.push(siteID);
      }

      input.onChange(changed);
    },
    [input]
  );

  return (
    <FieldSet>
      <FormField>
        <Localized id="community-siteModeratorModal-selectSites">
          <Label>Select sites to moderate</Label>
        </Localized>
        <ListGroup className={styles.listGroup}>
          {sites.map((site) => {
            const selectedIndex = input.value.indexOf(site.id);
            return (
              <ListGroupRow key={site.id}>
                <CheckBox
                  checked={selectedIndex >= 0}
                  onChange={onChange(site.id, selectedIndex)}
                >
                  {site.name}
                </CheckBox>
              </ListGroupRow>
            );
          })}
          {!loading && sites.length === 0 && (
            <Localized id="community-siteModeratorModal-noSites">
              <span>No sites</span>
            </Localized>
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
        </ListGroup>
      </FormField>
    </FieldSet>
  );
};

export default SiteModeratorModalSiteField;

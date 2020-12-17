import { Localized } from "@fluent/react/compat";
import { FieldArray, useField } from "formik";
import React, { FunctionComponent } from "react";

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
  const [field] = useField("siteIDs");

  return (
    <FieldSet>
      <FormField>
        <Localized id="community-siteModeratorModal-selectSites">
          <Label>Select sites to moderate</Label>
        </Localized>
        <pre>{field.value}</pre>
        <ListGroup className={styles.listGroup}>
          <FieldArray name="siteIDs">
            {({ push, remove }) => (
              <>
                {sites.map((site, index) => {
                  return (
                    <ListGroupRow key={site.id}>
                      <CheckBox
                        checked={
                          field.value && field.value.indexOf(site.id) >= 0
                        }
                        onChange={(event) => {
                          if (event.target.checked) {
                            push(site.id);
                          } else {
                            remove(field.value.indexOf(site.id));
                          }
                        }}
                      >
                        {site.name}
                      </CheckBox>
                    </ListGroupRow>
                  );
                })}
              </>
            )}
          </FieldArray>
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

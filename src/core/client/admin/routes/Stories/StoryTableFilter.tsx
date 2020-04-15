import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field, Form } from "react-final-form";

import { GQLSTORY_STATUS, GQLSTORY_STATUS_RL } from "coral-framework/schema";
import {
  Button,
  FieldSet,
  Flex,
  HorizontalGutter,
  Icon,
  Label,
  Option,
  SelectField,
  TextField,
} from "coral-ui/components/v2";

import styles from "./StoryTableFilter.css";

interface Props {
  statusFilter: GQLSTORY_STATUS_RL | null;
  onSetStatusFilter: (status: GQLSTORY_STATUS_RL) => void;
  searchFilter: string;
  onSetSearchFilter: (search: string) => void;
}

const StoryTableFilter: FunctionComponent<Props> = (props) => (
  <Flex itemGutter="double">
    <FieldSet>
      <HorizontalGutter spacing={2}>
        <Localized id="stories-filter-search">
          <Label>Search</Label>
        </Localized>
        <Form
          initialValues={{ search: props.searchFilter }}
          onSubmit={({ search }: { search: string }) =>
            props.onSetSearchFilter(search)
          }
        >
          {({ handleSubmit }) => (
            <form
              autoComplete="off"
              onSubmit={handleSubmit}
              id="configure-form"
            >
              <Field name="search">
                {({ input }) => (
                  <Localized
                    id="stories-filter-searchField"
                    attrs={{ placeholder: true, "aria-label": true }}
                  >
                    <TextField
                      {...input}
                      className={styles.textField}
                      color="dark"
                      placeholder="Search by story title or author..."
                      aria-label="Search by story title or author"
                      variant="seamlessAdornment"
                      adornment={
                        <Localized
                          id="stories-filter-searchButton"
                          attrs={{ "aria-label": true }}
                        >
                          <Button
                            className={styles.adornment}
                            type="submit"
                            color="dark"
                            adornmentRight
                            aria-label="Search"
                          >
                            <Icon size="md">search</Icon>
                          </Button>
                        </Localized>
                      }
                    />
                  </Localized>
                )}
              </Field>
            </form>
          )}
        </Form>
      </HorizontalGutter>
    </FieldSet>
    <FieldSet>
      <HorizontalGutter spacing={2}>
        <Localized id="stories-filter-statuses">
          <Label>Status</Label>
        </Localized>
        <Localized
          id="stories-filter-statusSelectField"
          attrs={{ "aria-label": true }}
        >
          <SelectField
            aria-label="Search by status"
            value={props.statusFilter || ""}
            onChange={(e) =>
              props.onSetStatusFilter((e.target.value as any) || null)
            }
          >
            <Localized id="stories-filter-allStories">
              <Option value="">All Stories</Option>
            </Localized>
            <Localized id="stories-filter-openStories">
              <Option value={GQLSTORY_STATUS.OPEN}>Open Stories</Option>
            </Localized>
            <Localized id="stories-filter-closedStories">
              <Option value={GQLSTORY_STATUS.CLOSED}>Closed Stories</Option>
            </Localized>
          </SelectField>
        </Localized>
      </HorizontalGutter>
    </FieldSet>
  </Flex>
);

export default StoryTableFilter;

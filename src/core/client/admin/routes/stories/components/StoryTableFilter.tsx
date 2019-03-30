import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Field, Form } from "react-final-form";

import { GQLSTORY_STATUS, GQLSTORY_STATUS_RL } from "talk-framework/schema";
import {
  FieldSet,
  Flex,
  Option,
  SelectField,
  TextField,
  Typography,
} from "talk-ui/components";

import styles from "./StoryTableFilter.css";

interface Props {
  statusFilter: GQLSTORY_STATUS_RL | null;
  onSetStatusFilter: (status: GQLSTORY_STATUS_RL) => void;
  searchFilter: string;
  onSetSearchFilter: (search: string) => void;
}

const StoryTableFilter: StatelessComponent<Props> = props => (
  <Flex itemGutter="double">
    <FieldSet>
      <Localized id="stories-filter-search">
        <Typography
          container="legend"
          className={styles.legend}
          variant="bodyCopyBold"
        >
          Search
        </Typography>
      </Localized>
      <Form
        onSubmit={({ search }: { search: string }) =>
          props.onSetSearchFilter(search)
        }
      >
        {({ handleSubmit }) => (
          <form autoComplete="off" onSubmit={handleSubmit} id="configure-form">
            <Field name="search">
              {({ input }) => (
                <Localized
                  id="stories-filter-searchField"
                  attrs={{ placeholder: true, "aria-label": true }}
                >
                  <TextField
                    classes={{ input: styles.textField }}
                    placeholder="Search by story title or author..."
                    aria-label="Search by story title or author"
                    name={input.name}
                    onChange={input.onChange}
                    value={input.value}
                  />
                </Localized>
              )}
            </Field>
          </form>
        )}
      </Form>
    </FieldSet>
    <FieldSet>
      <Localized id="stories-filter-showMe">
        <Typography
          className={styles.legend}
          container="legend"
          variant="bodyCopyBold"
        >
          Show Me
        </Typography>
      </Localized>
      <Localized
        id="stories-filter-statusSelectField"
        attrs={{ "aria-label": true }}
      >
        <SelectField
          aria-label="Search by status"
          value={props.statusFilter || ""}
          onChange={e =>
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
    </FieldSet>
  </Flex>
);

export default StoryTableFilter;

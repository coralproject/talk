import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Field, Form } from "react-final-form";

import { GQLUSER_ROLE, GQLUSER_ROLE_RL } from "talk-framework/schema";
import {
  FieldSet,
  Flex,
  OptGroup,
  Option,
  SelectField,
  TextField,
  Typography,
} from "talk-ui/components";

import styles from "./UserTableFilter.css";

interface Props {
  roleFilter: GQLUSER_ROLE_RL | null;
  onSetRoleFilter: (role: GQLUSER_ROLE_RL) => void;
  searchFilter: string;
  onSetSearchFilter: (search: string) => void;
}

const UserTableFilter: StatelessComponent<Props> = props => (
  <Flex itemGutter="double">
    <FieldSet>
      <Localized id="community-filter-search">
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
                  id="community-filter-searchField"
                  attrs={{ placeholder: true, "aria-label": true }}
                >
                  <TextField
                    classes={{ input: styles.textField }}
                    placeholder="Search by username or email address..."
                    aria-label="Search by username or email address"
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
      <Localized id="community-filter-showMe">
        <Typography
          className={styles.legend}
          container="legend"
          variant="bodyCopyBold"
        >
          Show Me
        </Typography>
      </Localized>
      <Localized
        id="community-filter-roleSelectField"
        attrs={{ "aria-label": true }}
      >
        <SelectField
          aria-label="Search by role"
          value={props.roleFilter || ""}
          onChange={e => props.onSetRoleFilter((e.target.value as any) || null)}
        >
          <Localized id="community-filter-everyone">
            <Option value="">Everyone</Option>
          </Localized>
          <Localized
            id="community-filter-optGroupAudience"
            attrs={{ label: true }}
          >
            <OptGroup label="Audience">
              <Localized id="role-plural-commenter">
                <Option value={GQLUSER_ROLE.COMMENTER}>Commenters</Option>
              </Localized>
            </OptGroup>
          </Localized>
          <Localized
            id="community-filter-optGroupOrganization"
            attrs={{ label: true }}
          >
            <OptGroup label="Organization">
              <Localized id="role-plural-admin">
                <Option value={GQLUSER_ROLE.ADMIN}>Admins</Option>
              </Localized>
              <Localized id="role-plural-moderator">
                <Option value={GQLUSER_ROLE.MODERATOR}>Moderators</Option>
              </Localized>
              <Localized id="role-plural-staff">
                <Option value={GQLUSER_ROLE.STAFF}>Staff</Option>
              </Localized>
            </OptGroup>
          </Localized>
        </SelectField>
      </Localized>
    </FieldSet>
  </Flex>
);

export default UserTableFilter;

import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { GQLUSER_ROLE_RL } from "talk-framework/schema";
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
      <Localized
        id="community-filter-searchField"
        attrs={{ placeholder: true }}
      >
        <TextField
          classes={{ input: styles.textField }}
          placeholder="Search by username or email address..."
        />
      </Localized>
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
      <SelectField
        value={props.roleFilter || ""}
        onChange={e => props.onSetRoleFilter(e.target.value as any)}
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
              <Option value="COMMENTER">Commenters</Option>
            </Localized>
          </OptGroup>
        </Localized>
        <Localized
          id="community-filter-optGroupOrganization"
          attrs={{ label: true }}
        >
          <OptGroup label="Organization">
            <Localized id="role-plural-admin">
              <Option value="ADMIN">Admins</Option>
            </Localized>
            <Localized id="role-plural-moderator">
              <Option value="MODERATOR">Moderators</Option>
            </Localized>
            <Localized id="role-plural-staff">
              <Option value="STAFF">Staff</Option>
            </Localized>
          </OptGroup>
        </Localized>
      </SelectField>
    </FieldSet>
  </Flex>
);

export default UserTableFilter;

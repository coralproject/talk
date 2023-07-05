import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field, Form } from "react-final-form";

import {
  GQLUSER_ROLE,
  GQLUSER_ROLE_RL,
  GQLUSER_STATUS_FILTER,
  GQLUSER_STATUS_FILTER_RL,
} from "coral-framework/schema";
import {
  Button,
  FieldSet,
  Flex,
  HorizontalGutter,
  Icon,
  Label,
  OptGroup,
  Option,
  SelectField,
  TextField,
} from "coral-ui/components/v2";
import { PropTypesOf } from "coral-ui/types";

import { InviteUsersContainer } from "./InviteUsers";

import styles from "./UserTableFilter.css";

interface Props {
  roleFilter: GQLUSER_ROLE_RL | null;
  onSetRoleFilter: (role: GQLUSER_ROLE_RL) => void;
  statusFilter: GQLUSER_STATUS_FILTER_RL | null;
  onSetStatusFilter: (role: GQLUSER_STATUS_FILTER_RL) => void;
  searchFilter: string;
  onSetSearchFilter: (search: string) => void;
  viewer: PropTypesOf<typeof InviteUsersContainer>["viewer"];
  settings: PropTypesOf<typeof InviteUsersContainer>["settings"];
  moderationScopesEnabled: boolean;
}

const UserTableFilter: FunctionComponent<Props> = (props) => (
  <Flex justifyContent="space-between" alignItems="flex-end">
    <Flex itemGutter="double">
      <FieldSet>
        <HorizontalGutter spacing={2}>
          <Localized id="community-filter-search">
            <Label>Search</Label>
          </Localized>
          <Form
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
                      id="community-filter-searchField"
                      attrs={{ placeholder: true, "aria-label": true }}
                    >
                      <TextField
                        {...input}
                        className={styles.textField}
                        color="dark"
                        placeholder="Search by username or email address..."
                        aria-label="Search by username or email address"
                        variant="seamlessAdornment"
                        adornment={
                          <Localized
                            id="community-filter-searchButton"
                            attrs={{ "aria-label": true }}
                          >
                            <Button
                              className={styles.adornment}
                              adornmentRight
                              type="submit"
                              color="dark"
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
          <Localized id="community-filter-showMe">
            <Label>Show Me</Label>
          </Localized>
          <Flex itemGutter>
            <Localized
              id="community-filter-roleSelectField"
              attrs={{ "aria-label": true }}
            >
              <SelectField
                aria-label="Search by role"
                value={props.roleFilter || ""}
                className={styles.selectField}
                onChange={(e) =>
                  props.onSetRoleFilter((e.target.value as any) || null)
                }
              >
                <Localized id="community-filter-allRoles">
                  <Option value="">All Roles</Option>
                </Localized>
                <Localized
                  id="community-filter-optGroupAudience"
                  attrs={{ label: true }}
                >
                  <OptGroup label="Audience">
                    <Localized id="role-plural-commenter">
                      <Option value={GQLUSER_ROLE.COMMENTER}>Commenters</Option>
                    </Localized>
                    <Localized id="role-plural-member">
                      <Option value={GQLUSER_ROLE.MEMBER}>Members</Option>
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
            <Localized
              id="community-filter-statusSelectField"
              attrs={{ "aria-label": true }}
            >
              <SelectField
                aria-label="Search by status"
                value={props.statusFilter || ""}
                className={styles.selectField}
                onChange={(e) =>
                  props.onSetStatusFilter((e.target.value as any) || null)
                }
              >
                <Localized id="community-filter-allStatuses">
                  <Option value="">All Statuses</Option>
                </Localized>
                <Localized id="userStatus-active">
                  <Option value={GQLUSER_STATUS_FILTER.ACTIVE}>Active</Option>
                </Localized>
                <Localized id="userStatus-suspended">
                  <Option value={GQLUSER_STATUS_FILTER.SUSPENDED}>
                    Suspended
                  </Option>
                </Localized>
                <Localized id="userStatus-banned">
                  <Option value={GQLUSER_STATUS_FILTER.BANNED}>Banned</Option>
                </Localized>
                {props.moderationScopesEnabled && (
                  <Localized id="userStatus-siteBanned">
                    <Option value={GQLUSER_STATUS_FILTER.SITE_BANNED}>
                      Site banned
                    </Option>
                  </Localized>
                )}
                <Localized id="userStatus-premod">
                  <Option value={GQLUSER_STATUS_FILTER.PREMOD}>
                    Always Premoderate
                  </Option>
                </Localized>
              </SelectField>
            </Localized>
          </Flex>
        </HorizontalGutter>
      </FieldSet>
    </Flex>
    <InviteUsersContainer viewer={props.viewer} settings={props.settings} />
  </Flex>
);

export default UserTableFilter;

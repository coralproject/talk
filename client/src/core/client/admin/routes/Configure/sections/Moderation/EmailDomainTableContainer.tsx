import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { graphql } from "relay-runtime";

import { urls } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { getMessage } from "coral-framework/lib/i18n";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { GQLNEW_USER_MODERATION } from "coral-framework/schema";
import { BinIcon, ButtonSvgIcon, PencilIcon } from "coral-ui/components/icons";
import {
  Button,
  Flex,
  Option,
  SelectField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "coral-ui/components/v2";

import DeleteEmailDomainMutation from "../EmailDomains/DeleteEmailDomainMutation";

import { EmailDomainTableContainer_settings } from "coral-admin/__generated__/EmailDomainTableContainer_settings.graphql";

import styles from "./EmailDomainTableContainer.css";

interface Props {
  settings: EmailDomainTableContainer_settings;
}

const EmailDomainTableContainer: FunctionComponent<Props> = ({ settings }) => {
  const { emailDomainModeration } = settings;
  const { localeBundles } = useCoralContext();
  const deleteEmailDomain = useMutation(DeleteEmailDomainMutation);
  const [statusFilter, setStatusFilter] = useState<GQLNEW_USER_MODERATION | "">(
    ""
  );

  const reversedDomains = useMemo(() => {
    return emailDomainModeration.slice().reverse();
  }, [emailDomainModeration]);

  const domainsToShow = useMemo(() => {
    if (statusFilter === GQLNEW_USER_MODERATION.BAN) {
      return reversedDomains.filter(
        (d) => d.newUserModeration === GQLNEW_USER_MODERATION.BAN
      );
    } else if (statusFilter === GQLNEW_USER_MODERATION.PREMOD) {
      return reversedDomains.filter(
        (d) => d.newUserModeration === GQLNEW_USER_MODERATION.PREMOD
      );
    } else {
      return reversedDomains;
    }
  }, [reversedDomains, statusFilter]);

  const onDelete = useCallback(
    async (domainId: string) => {
      const message = getMessage(
        localeBundles,
        "configure-moderation-emailDomains-confirmDelete",
        "Deleting this email domain will stop any new accounts created with it from being banned or always pre-moderated. Are you sure you want to continue?"
      );

      // eslint-disable-next-line no-restricted-globals
      if (window.confirm(message)) {
        await deleteEmailDomain({ id: domainId });
      }
    },
    [deleteEmailDomain, localeBundles]
  );

  return (
    <>
      {emailDomainModeration.length === 0 && (
        <Localized id="configuration-moderation-emailDomains-empty">
          <div className={styles.empty}>
            There are no email domains configured.
          </div>
        </Localized>
      )}
      {emailDomainModeration.length > 0 && (
        <>
          <Localized
            id="configure-moderation-emailDomains-filterByStatus"
            attrs={{ "aria-label": true }}
          >
            <SelectField
              aria-label="Filter by email domain status"
              value={statusFilter || ""}
              onChange={(e) => {
                if (
                  e.target.value === "" ||
                  e.target.value === GQLNEW_USER_MODERATION.BAN ||
                  e.target.value === GQLNEW_USER_MODERATION.PREMOD
                ) {
                  setStatusFilter(e.target.value);
                }
              }}
            >
              <Localized id="configure-moderation-emailDomains-allDomains">
                <Option value="">All domains</Option>
              </Localized>
              <Localized id="configure-moderation-emailDomains-banned">
                <Option value={GQLNEW_USER_MODERATION.BAN}>Banned</Option>
              </Localized>
              <Localized id="configure-moderation-emailDomains-preMod">
                <Option value={GQLNEW_USER_MODERATION.PREMOD}>Pre-mod</Option>
              </Localized>
            </SelectField>
          </Localized>
          <Table
            fullWidth
            data-testid="configuration-moderation-emailDomains-table"
          >
            <TableHead>
              <TableRow>
                <Localized id="configure-moderation-emailDomains-table-domain">
                  <TableCell>Domain</TableCell>
                </Localized>
                <Localized id="configure-moderation-emailDomains-table-action">
                  <TableCell>Action</TableCell>
                </Localized>
              </TableRow>
            </TableHead>
            <TableBody>
              {domainsToShow.map((domain) => {
                const actionDetails =
                  domain.newUserModeration === "BAN"
                    ? {
                        id: "configure-moderation-emailDomains-banAllUsers",
                        message: "Ban all new commenter accounts",
                      }
                    : {
                        id: "configure-moderation-emailDomains-alwaysPremod",
                        message: "Always pre-moderate comments",
                      };
                const actionText = getMessage(
                  localeBundles,
                  actionDetails.id,
                  actionDetails.message
                );
                return (
                  <TableRow key={domain.id}>
                    <TableCell>{domain.domain}</TableCell>
                    <TableCell>
                      <Flex>
                        {actionText}
                        <Flex className={styles.buttons}>
                          <Localized
                            id="configure-moderation-emailDomains-table-edit"
                            elems={{
                              icon: <ButtonSvgIcon Icon={PencilIcon} />,
                            }}
                          >
                            <Button
                              variant="text"
                              iconLeft
                              to={`${urls.admin.configureModeration}/domains/${domain.id}`}
                              className={styles.editButton}
                            >
                              Edit
                            </Button>
                          </Localized>
                          <Localized
                            id="configure-moderation-emailDomains-table-delete"
                            elems={{
                              icon: <ButtonSvgIcon Icon={BinIcon} />,
                            }}
                          >
                            <Button
                              variant="text"
                              iconLeft
                              onClick={() => onDelete(domain.id)}
                              data-testid={`domain-delete-${domain.id}`}
                            >
                              Delete
                            </Button>
                          </Localized>
                        </Flex>
                      </Flex>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </>
      )}
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment EmailDomainTableContainer_settings on Settings {
      emailDomainModeration {
        domain
        id
        newUserModeration
      }
    }
  `,
})(EmailDomainTableContainer);

export default enhanced;

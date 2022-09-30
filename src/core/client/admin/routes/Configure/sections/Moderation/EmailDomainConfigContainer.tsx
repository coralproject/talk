import { Localized } from "@fluent/react/compat";
import { useRouter } from "found";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "relay-runtime";

import { urls } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { getMessage } from "coral-framework/lib/i18n";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import {
  Button,
  ButtonIcon,
  Flex,
  FormFieldDescription,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "coral-ui/components/v2";

import { EmailDomainConfigContainer_settings } from "coral-admin/__generated__/EmailDomainConfigContainer_settings.graphql";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import DeleteEmailDomainMutation from "../EmailDomains/DeleteEmailDomainMutation";

import styles from "./EmailDomainConfigContainer.css";

interface Props {
  settings: EmailDomainConfigContainer_settings;
}

const EmailDomainConfigContainer: FunctionComponent<Props> = ({ settings }) => {
  const { emailDomainModeration } = settings;
  const { localeBundles } = useCoralContext();
  const { router } = useRouter();
  const deleteEmailDomain = useMutation(DeleteEmailDomainMutation);

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
    [router]
  );

  return (
    <ConfigBox
      id="emailDomain"
      data-testid="emailDomain-container"
      title={
        <Localized id="configure-moderation-emailDomains-header">
          <Header container="legend">Email domain</Header>
        </Localized>
      }
    >
      <Localized id="configure-moderation-emailDomains-description">
        <FormFieldDescription>
          Create rules to take action on accounts or comments based on the
          account holder's email address domain. Action only applies to newly
          created accounts.
        </FormFieldDescription>
      </Localized>
      <Localized
        id="configure-moderation-emailDomains-addDomain"
        elems={{ icon: <ButtonIcon>add</ButtonIcon> }}
      >
        <Button to="/admin/configure/moderation/domains/add" iconLeft>
          Add domain
        </Button>
      </Localized>
      {emailDomainModeration.length > 0 && (
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
            {emailDomainModeration.map((domain) => {
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
                          elems={{ icon: <ButtonIcon>edit</ButtonIcon> }}
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
                          elems={{ icon: <ButtonIcon>delete</ButtonIcon> }}
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
      )}
    </ConfigBox>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment EmailDomainConfigContainer_settings on Settings {
      emailDomainModeration {
        domain
        id
        newUserModeration
      }
    }
  `,
})(EmailDomainConfigContainer);

export default enhanced;

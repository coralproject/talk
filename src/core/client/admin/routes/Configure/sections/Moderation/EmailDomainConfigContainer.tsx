import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

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
import { graphql } from "relay-runtime";
import { withFragmentContainer } from "coral-framework/lib/relay";

import styles from "./EmailDomainConfigContainer.css";

interface Props {
  settings: EmailDomainConfigContainer_settings;
}

const EmailDomainConfigContainer: FunctionComponent<Props> = ({ settings }) => {
  const { emailDomains } = settings;

  return (
    <ConfigBox
      id="Users"
      title={
        <Localized id="configure-moderation-emailDomains-header">
          <Header container="legend">Email domain</Header>
        </Localized>
      }
    >
      <Localized id="configure-moderation-emailDomains-description">
        <FormFieldDescription>
          Create rules to take action on accounts or comments based on the
          account holder's email address domain.
        </FormFieldDescription>
      </Localized>
      <Localized id="configure-moderation-emailDomains-form-addDomain">
        <Button to="/admin/configure/moderation/domains/add" iconLeft>
          <ButtonIcon size="md">add</ButtonIcon>
          Add domain
        </Button>
      </Localized>
      {emailDomains.length > 0 && (
        <Table fullWidth>
          <TableHead>
            <TableRow>
              <TableCell>Domain</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emailDomains.map((domain) => {
              const actionText =
                domain.newUserModeration === "BANNED"
                  ? "Ban user"
                  : "Reject comments";
              return (
                <>
                  <TableRow>
                    <TableCell>{domain.domain}</TableCell>
                    <TableCell>
                      <Flex>
                        {actionText}
                        <Flex className={styles.buttons}>
                          <Button
                            variant="text"
                            iconLeft
                            to={`/admin/configure/moderation/domains/${domain.id}`}
                            className={styles.editButton}
                          >
                            <ButtonIcon size="md">edit</ButtonIcon>Edit
                          </Button>
                          <Button variant="text" iconLeft>
                            <ButtonIcon size="md">delete</ButtonIcon>Delete
                          </Button>
                        </Flex>
                      </Flex>
                    </TableCell>
                  </TableRow>
                </>
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
      emailDomains {
        domain
        id
        newUserModeration
      }
    }
  `,
})(EmailDomainConfigContainer);

export default enhanced;

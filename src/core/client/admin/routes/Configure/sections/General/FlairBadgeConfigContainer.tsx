import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { colorFromMeta } from "coral-framework/lib/form";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { validateImageURL } from "coral-framework/lib/validation";
import { AddIcon, BinIcon, ButtonSvgIcon } from "coral-ui/components/icons";
import {
  Button,
  CallOut,
  FieldSet,
  Flex,
  FormField,
  FormFieldDescription,
  HelperText,
  HorizontalGutter,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "coral-ui/components/v2";

import { FlairBadgeConfigContainer_settings as SettingsData } from "coral-admin/__generated__/FlairBadgeConfigContainer_settings.graphql";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import OnOffField from "../../OnOffField";
import CreateFlairBadgeMutation from "./CreateFlairBadgeMutation";
import DeleteFlairBadgeMutation from "./DeleteFlairBadgeMutation";

import styles from "./FlairBadgeConfigContainer.css";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment FlairBadgeConfigContainer_formValues on Settings {
    flairBadges {
      flairBadgesEnabled
    }
  }
`;

interface Props {
  disabled: boolean;
  settings: SettingsData;
}

const FlairBadgeConfigContainer: FunctionComponent<Props> = ({
  disabled,
  settings,
}) => {
  const addFlairBadge = useMutation(CreateFlairBadgeMutation);
  const deleteFlairBadge = useMutation(DeleteFlairBadgeMutation);
  const [flairBadgeURLInput, setFlairBadgeURLInput] = useState<string>("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const onSubmit = useCallback(async () => {
    try {
      await addFlairBadge({ flairBadgeURL: flairBadgeURLInput });
      setFlairBadgeURLInput("");
    } catch (e) {
      setSubmitError(e.message);
    }
  }, [flairBadgeURLInput, setFlairBadgeURLInput, addFlairBadge]);
  const onDelete = useCallback(
    async (url: string) => {
      await deleteFlairBadge({ flairBadgeURL: url });
    },
    [deleteFlairBadge]
  );
  const validFlairURL = useCallback(
    (values: string) => {
      const isValid = validateImageURL(flairBadgeURLInput, values);
      return !(isValid === undefined);
    },
    [flairBadgeURLInput, validateImageURL]
  );
  return (
    <ConfigBox
      title={
        <Localized id="configure-general-flairBadge-header">
          <Header container={<legend />}>Custom flair badges</Header>
        </Localized>
      }
      container={<FieldSet />}
      data-testid="custom-flair-badge-configuration"
    >
      <Localized
        id="configure-general-flairBadge-description"
        elems={{
          externalLink: (
            <ExternalLink href="https://docs.coralproject.net/sso" />
          ),
        }}
      >
        <FormFieldDescription>
          Encourage user engagement and participation by adding custom flair
          badges for your site. Badges can be allocated as part of your{" "}
          <ExternalLink href="https://docs.coralproject.net/sso">
            JWT claim
          </ExternalLink>
          .
        </FormFieldDescription>
      </Localized>
      <FormField container={<FieldSet />}>
        <Localized id="configure-general-flairBadge-enable-label">
          <Label component="legend">Enable custom flair badges</Label>
        </Localized>
        <OnOffField name="flairBadges.flairBadgesEnabled" disabled={disabled} />
      </FormField>
      <HorizontalGutter size="double">
        <Field name="flairBadgeURL">
          {({ input, meta }) => (
            <FormField>
              <Localized id="configure-general-flairBadge-add">
                <Label>Add flair by URL</Label>
              </Localized>
              <Localized id="configure-general-flairBadge-add-helperText">
                <HelperText>
                  Paste the web address for your custom flair badge. Supported
                  file types: png, jpeg, jpg, and gif
                </HelperText>
              </Localized>
              <Flex>
                <TextField
                  {...input}
                  className={styles.flairBadgeURLInput}
                  placeholder={"https://www.example.com/myimage.jpg"}
                  color={colorFromMeta(meta)}
                  fullWidth
                  onChange={(e) => setFlairBadgeURLInput(e.target.value)}
                  value={flairBadgeURLInput}
                />
                <Localized id="configure-general-flairBadge-add-button">
                  <Button
                    iconLeft
                    className={styles.addButton}
                    size="large"
                    onClick={() => onSubmit()}
                    disabled={validFlairURL(input.value)}
                  >
                    <ButtonSvgIcon Icon={AddIcon} />
                    Add
                  </Button>
                </Localized>
              </Flex>
              {submitError && (
                <CallOut fullWidth color="error">
                  {submitError}
                </CallOut>
              )}
            </FormField>
          )}
        </Field>
      </HorizontalGutter>

      <Table fullWidth>
        <TableHead>
          <TableRow>
            <Localized id="configure-general-flairBadge-table-flairURL">
              <TableCell>Flair URL</TableCell>
            </Localized>
            <Localized id="configure-general-flairBadge-table-preview">
              <TableCell>Preview</TableCell>
            </Localized>
          </TableRow>
        </TableHead>
        {settings.flairBadges?.flairBadgeURLs &&
          settings.flairBadges.flairBadgeURLs.length > 0 && (
            <TableBody>
              {settings.flairBadges.flairBadgeURLs.map((url) => {
                return (
                  <TableRow key={url}>
                    <TableCell className={styles.urlTableCell}>{url}</TableCell>
                    <TableCell>
                      <Flex>
                        <img className={styles.imagePreview} src={url} alt="" />
                        <Flex className={styles.deleteButton}>
                          <Localized
                            id="configure-general-flairBadge-table-deleteButton"
                            elems={{
                              icon: <ButtonSvgIcon Icon={BinIcon} />,
                            }}
                          >
                            <Button
                              variant="text"
                              iconLeft
                              onClick={() => onDelete(url)}
                            >
                              <ButtonSvgIcon Icon={BinIcon} />
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
          )}
      </Table>
      {(!settings.flairBadges?.flairBadgeURLs ||
        settings.flairBadges.flairBadgeURLs.length === 0) && (
        <Localized id="configure-general-flairBadge-table-empty">
          <HelperText className={styles.emptyCustomFlairText}>
            No custom flair added for this site
          </HelperText>
        </Localized>
      )}
    </ConfigBox>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment FlairBadgeConfigContainer_settings on Settings {
      flairBadges {
        flairBadgeURLs
      }
    }
  `,
})(FlairBadgeConfigContainer);

export default enhanced;

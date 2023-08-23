import { Localized } from "@fluent/react/compat";
import React, {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useState,
} from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { FLAIR_BADGE_NAME_REGEX } from "coral-common/constants";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { validateImageURLFunc } from "coral-framework/lib/validation";
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
  ValidationMessage,
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

const isValidName = (value: string) => {
  const regex = new RegExp(FLAIR_BADGE_NAME_REGEX);
  const nameResult = regex.exec(value);
  if (nameResult === null || nameResult === undefined) {
    return false;
  }

  return true;
};

const isValidURL = (value: string) => {
  const urlValidationResult = validateImageURLFunc(value);
  return urlValidationResult;
};

const FlairBadgeConfigContainer: FunctionComponent<Props> = ({
  disabled,
  settings,
}) => {
  const addFlairBadge = useMutation(CreateFlairBadgeMutation);
  const deleteFlairBadge = useMutation(DeleteFlairBadgeMutation);

  const [flairBadgeNameInput, setFlairBadgeNameInput] = useState<string>("");
  const [flairBadgeURLInput, setFlairBadgeURLInput] = useState<string>("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<boolean>(false);
  const [urlError, setURLError] = useState<boolean>(false);

  const onSubmit = useCallback(async () => {
    try {
      setSubmitError(null);
      setNameError(false);
      setURLError(false);

      let haveValidationError = false;

      // Check the name
      if (!isValidName(flairBadgeNameInput)) {
        setNameError(true);
        haveValidationError = true;
      }

      // Check the URL
      if (!isValidURL(flairBadgeURLInput)) {
        setURLError(true);
        haveValidationError = true;
      }

      if (haveValidationError) {
        return;
      }

      await addFlairBadge({
        url: flairBadgeURLInput,
        name: flairBadgeNameInput,
      });

      setFlairBadgeNameInput("");
      setFlairBadgeURLInput("");
    } catch (e) {
      setSubmitError(e.message);
    }
  }, [addFlairBadge, flairBadgeURLInput, flairBadgeNameInput]);

  const onDelete = useCallback(
    async (name: string) => {
      await deleteFlairBadge({ name });
    },
    [deleteFlairBadge]
  );

  const onChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNameError(false);
    setFlairBadgeNameInput(e.target.value);
  }, []);

  const onChangeURL = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setURLError(false);
    setFlairBadgeURLInput(e.target.value);
  }, []);

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
        <FormField>
          <Localized id="configure-general-flairBadge-add-name">
            <Label>Flair name</Label>
          </Localized>
          <Localized id="configure-general-flairBadge-add-name-helperText">
            <HelperText>
              Name the flair with a descriptive identifier
            </HelperText>
          </Localized>
          <TextField
            data-testid="flairBadgeNameInput"
            className={styles.flairBadgeNameInput}
            placeholder={"subscriber"}
            color={nameError ? "error" : "regular"}
            fullWidth
            onChange={onChangeName}
            value={flairBadgeNameInput}
          />
          {nameError && (
            <ValidationMessage fullWidth>
              <Localized id="configure-general-flairBadge-name-permittedCharacters">
                Only letters, numbers, and the special characters - . are
                permitted.
              </Localized>
            </ValidationMessage>
          )}
        </FormField>
        <FormField>
          <Localized id="configure-general-flairBadge-add">
            <Label>Flair URL</Label>
          </Localized>
          <Localized id="configure-general-flairBadge-add-helperText">
            <HelperText>
              Paste the web address for your custom flair badge. Supported file
              types: png, jpeg, jpg, and gif
            </HelperText>
          </Localized>
          <TextField
            data-testid="flairBadgeURLInput"
            className={styles.flairBadgeURLInput}
            placeholder={"https://www.example.com/myimage.jpg"}
            color={urlError ? "error" : "regular"}
            fullWidth
            onChange={onChangeURL}
            value={flairBadgeURLInput}
          />
          {urlError && (
            <ValidationMessage fullWidth>
              <Localized id="configure-general-flairBadge-url-error">
                The URL is invalid or has an unsupported file type.
              </Localized>
            </ValidationMessage>
          )}
        </FormField>
        <Field name="flairBadgeSubmit">
          {({ input }) => (
            <FormField>
              <Flex>
                <Localized id="configure-general-flairBadge-add-button">
                  <Button
                    iconLeft
                    className={styles.addButton}
                    size="large"
                    onClick={() => onSubmit()}
                    disabled={disabled}
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
            <Localized id="configure-general-flairBadge-table-flairName">
              <TableCell>Name</TableCell>
            </Localized>
            <Localized id="configure-general-flairBadge-table-flairURL">
              <TableCell>URL</TableCell>
            </Localized>
            <Localized id="configure-general-flairBadge-table-preview">
              <TableCell>Preview</TableCell>
            </Localized>
          </TableRow>
        </TableHead>
        {settings.flairBadges?.badges &&
          settings.flairBadges.badges.length > 0 && (
            <TableBody>
              {settings.flairBadges.badges.map((badge) => {
                return (
                  <TableRow key={badge.name}>
                    <TableCell className={styles.urlTableCell}>
                      {badge.name}
                    </TableCell>
                    <TableCell className={styles.urlTableCell}>
                      {badge.url}
                    </TableCell>
                    <TableCell>
                      <Flex>
                        <img
                          className={styles.imagePreview}
                          src={badge.url}
                          alt={" "}
                        />
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
                              onClick={() => onDelete(badge.name)}
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
      {(!settings.flairBadges?.badges ||
        settings.flairBadges.badges.length === 0) && (
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
        flairBadgesEnabled
        badges {
          name
          url
        }
      }
    }
  `,
})(FlairBadgeConfigContainer);

export default enhanced;

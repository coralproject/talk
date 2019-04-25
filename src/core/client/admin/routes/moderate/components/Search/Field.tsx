import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, HTMLAttributes } from "react";
import { Field as FormField } from "react-final-form";

import { BaseButton, Flex, Icon } from "talk-ui/components";

import styles from "./Field.css";

interface Props extends HTMLAttributes<HTMLInputElement> {
  /** title of the story */
  title: string;
  className?: string;
  focused?: boolean;
}

/**
 * Field is the TextField for the search entry.
 */
const Field: FunctionComponent<Props> = ({
  title,
  focused,
  className,
  onBlur,
  onChange,
  ...rest
}) => {
  const placeholder = focused
    ? "Use quotation marks around each search term (e.g. “team”, “St. Louis”)"
    : title;
  return (
    <FormField name="search">
      {({ input }) => (
        <Flex className={cn(className, styles.root)} alignItems="stretch">
          <Flex className={styles.begin} alignItems="center">
            <Icon className={styles.searchIcon} size="md">
              search
            </Icon>
            {focused && (
              <Localized id="moderate-searchBar-stories">
                <div className={styles.beginStories}>Stories:</div>
              </Localized>
            )}
          </Flex>
          <Localized
            id="moderate-searchBar-comboBoxTextField"
            attrs={{ "aria-label": true, placeholder: Boolean(focused) }}
          >
            <input
              name={input.name}
              onChange={evt => {
                if (onChange) {
                  onChange(evt);
                }
                input.onChange(evt);
              }}
              value={input.value}
              className={cn(styles.input, {
                [styles.inputWithTitle]: !focused,
              })}
              placeholder={placeholder}
              aria-label="Search or jump to story..."
              autoComplete="off"
              spellCheck={false}
              onBlur={evt => {
                // Reset value when blurring.
                input.onChange("");
                if (onBlur) {
                  onBlur(evt);
                }
              }}
              {...rest}
            />
          </Localized>
          <Flex className={styles.end} alignItems="center">
            {focused && (
              <Localized id="moderate-searchBar-searchButton">
                <BaseButton
                  className={styles.searchButton}
                  type="submit"
                  disabled={!Boolean(input.value)}
                >
                  Search
                </BaseButton>
              </Localized>
            )}
          </Flex>
        </Flex>
      )}
    </FormField>
  );
};

export default Field;

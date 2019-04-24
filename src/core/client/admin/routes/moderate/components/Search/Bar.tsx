import React, { FunctionComponent, useCallback } from "react";
import { Form } from "react-final-form";

import { Backdrop, Icon, Popover, SubBar } from "talk-ui/components";
import { combineEventHandlers } from "talk-ui/helpers";
import {
  useBlurOnEsc,
  useComboBox,
  useFocus,
  usePreventFocusLoss,
} from "talk-ui/hooks";
import { ListBoxOption } from "talk-ui/hooks/useComboBox";

import Field from "./Field";
import Group from "./Group";

import styles from "./Bar.css";

/** Group of listbox options. */
type Group = "CONTEXT" | "SEARCH";

interface Props {
  /** title of the current story */
  title: string;
  /** options to show in the combobox listbox */
  options: Array<ListBoxOption & { group: Group }>;
  /** onSearch will be called whenenver the user submits the search */
  onSearch?: (value: string) => void;
}

const Bar: FunctionComponent<Props> = ({ title, options, onSearch }) => {
  const [focused, focusHandlers] = useFocus();
  const preventFocusLossHandlers = usePreventFocusLoss(focused);
  const submitHandler = useCallback(
    ({ search }: { search: string }) => onSearch && onSearch(search),
    [onSearch]
  );
  const blurOnEscProps = useBlurOnEsc(focused);
  const [
    mappedOptions,
    activeDescendant,
    keyboardNavigationHandlers,
  ] = useComboBox("moderate-searchBar-listBoxOption", options);

  const contextOptions = mappedOptions
    .filter(o => o.group === "CONTEXT")
    .map(o => o.element);
  const searchOptions = mappedOptions
    .filter(o => o.group === "SEARCH")
    .map(o => o.element);

  return (
    <SubBar
      className={styles.root}
      data-testid="moderate-searchBar-container"
      role="combobox"
      aria-owns="moderate-searchBar-listBox"
      aria-label="Search or jump to story"
      aria-haspopup="listbox"
      aria-expanded={focused}
    >
      <Backdrop className={styles.bumpZIndex} active={focused} />
      <Form onSubmit={submitHandler}>
        {({ handleSubmit }) => (
          <form
            role="search"
            aria-label="story"
            className={styles.bumpZIndex}
            onSubmit={handleSubmit}
            {...preventFocusLossHandlers}
          >
            <Popover
              id={"moderate-searchBar-popover"}
              placement="bottom"
              description="A dialog showing a permalink to the comment"
              classes={{ popover: styles.popover }}
              visible={focused}
              eventsEnabled={false}
              modifiers={{
                preventOverflow: { enabled: false },
                flip: { enabled: false },
                hide: { enabled: false },
              }}
              body={() => (
                <ul
                  id="moderate-searchBar-listBox"
                  role="listbox"
                  className={styles.listBox}
                >
                  {contextOptions.length > 0 && (
                    <Group
                      title="Currently moderating"
                      id="moderate-searchBar-current"
                    >
                      {contextOptions}
                    </Group>
                  )}
                  {searchOptions.length > 0 && (
                    <Group
                      title={
                        <>
                          <Icon>search</Icon> Search results (Most recent first)
                        </>
                      }
                      id="moderate-searchBar-current"
                      light
                    >
                      {searchOptions}
                    </Group>
                  )}
                </ul>
              )}
            >
              {({ ref }) => (
                <div ref={ref}>
                  <Field
                    title={title}
                    {...combineEventHandlers(
                      focusHandlers,
                      blurOnEscProps,
                      keyboardNavigationHandlers
                    )}
                    focused={focused}
                    aria-controls="moderate-searchBar-listBox"
                    aria-autocomplete="list"
                    aria-activedescendant={activeDescendant}
                  />
                </div>
              )}
            </Popover>
          </form>
        )}
      </Form>
    </SubBar>
  );
};

export default Bar;

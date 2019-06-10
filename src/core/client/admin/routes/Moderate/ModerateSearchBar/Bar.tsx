import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { Form } from "react-final-form";

import { Backdrop, Icon, Popover, SubBar } from "coral-ui/components";
import { combineEventHandlers } from "coral-ui/helpers";
import {
  useBlurOnEsc,
  useComboBox,
  useFocus,
  usePreventFocusLoss,
} from "coral-ui/hooks";
import { ListBoxOption } from "coral-ui/hooks/useComboBox";

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

/**
 * Bar is the container of the whole search bar.
 */
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
    <Localized id="moderate-searchBar-comboBox" attrs={{ "aria-label": true }}>
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
            <Localized
              id="moderate-searchBar-searchForm"
              attrs={{ "aria-label": true }}
            >
              <form
                role="search"
                aria-label="Stories"
                className={styles.bumpZIndex}
                onSubmit={handleSubmit}
                {...preventFocusLossHandlers}
              >
                <Popover
                  id={"moderate-searchBar-popover"}
                  placement="bottom"
                  classes={{ popover: styles.popover }}
                  visible={focused}
                  eventsEnabled={false}
                  modifiers={{
                    preventOverflow: { enabled: false },
                    flip: { enabled: false },
                    hide: { enabled: false },
                    arrow: { enabled: false },
                  }}
                  body={() => (
                    <ul
                      id="moderate-searchBar-listBox"
                      role="listbox"
                      className={styles.listBox}
                    >
                      {contextOptions.length > 0 && (
                        <Localized
                          id="moderate-searchBar-currentlyModerating"
                          attrs={{ title: true }}
                        >
                          <Group
                            title="Currently moderating"
                            id="moderate-searchBar-context"
                          >
                            {contextOptions}
                          </Group>
                        </Localized>
                      )}
                      {searchOptions.length > 0 && (
                        <Group
                          title={
                            <>
                              <Icon>search</Icon>{" "}
                              <Localized id="moderate-searchBar-searchResultsMostRecentFirst">
                                <span>Search results (Most recent first)</span>
                              </Localized>
                            </>
                          }
                          id="moderate-searchBar-search"
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
            </Localized>
          )}
        </Form>
      </SubBar>
    </Localized>
  );
};

export default Bar;

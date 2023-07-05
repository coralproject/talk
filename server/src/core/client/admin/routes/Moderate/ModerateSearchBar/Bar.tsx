import { Localized } from "@fluent/react/compat";
import key from "keymaster";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Form } from "react-final-form";

import { HOTKEYS } from "coral-admin/constants";
import { Backdrop, Icon, Popover, SubBar } from "coral-ui/components/v2";
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

  siteSelector: React.ReactNode;
  sectionSelector?: React.ReactNode;

  multisite: boolean;
}

/**
 * Bar is the container of the whole search bar.
 */
const Bar: FunctionComponent<Props> = ({
  title,
  options,
  onSearch,
  siteSelector,
  sectionSelector,
  multisite,
}) => {
  const [focused, focusHandlers] = useFocus();
  const preventFocusLossHandlers = usePreventFocusLoss(focused);
  const submitHandler = useCallback(
    ({ search }: { search: string }) => onSearch && onSearch(search),
    [onSearch]
  );
  const searchInput = useRef<HTMLInputElement>(null);
  const blurOnEscProps = useBlurOnEsc(focused);
  const [mappedOptions, activeDescendant, keyboardNavigationHandlers] =
    useComboBox("moderate-searchBar-listBoxOption", options);

  useEffect(() => {
    key(HOTKEYS.SEARCH, () => {
      if (searchInput && searchInput.current) {
        searchInput.current.focus();
      }
    });
  }, [searchInput.current]);
  const contextOptions = mappedOptions
    .filter((o) => o.group === "CONTEXT")
    .map((o) => o.element);
  const searchOptions = mappedOptions
    .filter((o) => o.group === "SEARCH")
    .map((o) => o.element);

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
        {multisite ? siteSelector : sectionSelector}
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
                  classes={{
                    popover: multisite ? styles.popoverNarrow : styles.popover,
                  }}
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
                      {searchOptions.length === 1 && (
                        <Group
                          title={
                            <>
                              <Icon size="md" className={styles.groupIcon}>
                                search
                              </Icon>{" "}
                              <Localized id="moderate-searchBar-searchResults">
                                <span>Search results</span>
                              </Localized>
                            </>
                          }
                          id="moderate-searchBar-search"
                          light
                        >
                          {searchOptions}
                        </Group>
                      )}
                      {searchOptions.length > 1 && (
                        <Group
                          title={
                            <>
                              <Icon size="md" className={styles.groupIcon}>
                                search
                              </Icon>{" "}
                              <Localized id="moderate-searchBar-searchResultsMostRelevantFirst">
                                <span>
                                  Search results (Most relevant first)
                                </span>
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
                        multisite={multisite}
                        title={title}
                        ref={searchInput}
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

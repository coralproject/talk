import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { noop } from "lodash";
import React, {
  ComponentType,
  FunctionComponent,
  useEffect,
  useRef,
} from "react";

import AutoLoadMore from "coral-admin/components/AutoLoadMore";
import { IntersectionProvider } from "coral-framework/lib/intersection";
import {
  ArrowsDownIcon,
  ArrowsUpIcon,
  ButtonSvgIcon,
} from "coral-ui/components/icons";
import {
  ClickOutside,
  Dropdown,
  Flex,
  Popover,
  Spinner,
  TextField,
} from "coral-ui/components/v2";

import { useToggleState } from "coral-framework/hooks";
import styles from "./PaginatedSelect.css";

interface Props {
  onLoadMore?: () => void;
  onFilter?: (filter: string) => void;
  Icon?: ComponentType;
  hasMore?: boolean;
  disableLoadMore?: boolean;
  loading?: boolean;
  selected: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

const PaginatedSelect: FunctionComponent<Props> = ({
  onLoadMore = noop,
  onFilter,
  disableLoadMore = false,
  hasMore = false,
  loading = false,
  children,
  Icon,
  selected,
  className,
}) => {
  const filterRef = useRef<HTMLInputElement>(null);

  const [isPopoverVisible, setIsPopoverVisible, togglePopoverVisibility] =
    useToggleState(false);

  useEffect(() => {
    if (isPopoverVisible && filterRef.current) {
      filterRef.current.focus();
    }
  }, [isPopoverVisible]);

  return (
    <ClickOutside onClickOutside={() => setIsPopoverVisible(false)}>
      <Popover
        id=""
        placement="bottom-end"
        modifiers={{ arrow: { enabled: false }, offset: { offset: "0, 4" } }}
        visible={isPopoverVisible}
        body={() => (
          <IntersectionProvider>
            <Dropdown className={styles.dropdown}>
              {children}
              {loading && (
                <Flex justifyContent="center">
                  <Spinner />
                </Flex>
              )}
              {hasMore && (
                <Flex justifyContent="center">
                  <AutoLoadMore
                    disableLoadMore={disableLoadMore}
                    onLoadMore={onLoadMore}
                  />
                </Flex>
              )}
            </Dropdown>
          </IntersectionProvider>
        )}
      >
        {({ ref }) => (
          <Flex
            className={cn(styles.button, className)}
            onClick={togglePopoverVisibility}
            ref={ref}
            justifyContent="space-between"
          >
            {Icon && (
              <ButtonSvgIcon className={styles.buttonIconLeft} Icon={Icon} />
            )}
            {isPopoverVisible && !!onFilter ? (
              <Localized
                id="admin-paginatedSelect-filter"
                attrs={{ "aria-roledescription": true }}
              >
                <TextField
                  className={styles.filterInput}
                  onChange={(e) => onFilter(e.target.value)}
                  ref={filterRef}
                  aria-roledescription="Filter results"
                />
              </Localized>
            ) : (
              <Flex
                alignItems="center"
                className={styles.wrapper}
                style={{
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                role="button"
                tabIndex={0}
                onFocus={() => setIsPopoverVisible(true)}
                onBlur={() => setIsPopoverVisible(false)}
              >
                {selected}
              </Flex>
            )}
            {
              <ButtonSvgIcon
                className={styles.buttonIconRight}
                Icon={isPopoverVisible ? ArrowsUpIcon : ArrowsDownIcon}
                size="xs"
              />
            }
          </Flex>
        )}
      </Popover>
    </ClickOutside>
  );
};

export default PaginatedSelect;

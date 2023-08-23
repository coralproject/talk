import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { noop } from "lodash";
import React, {
  ComponentType,
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
} from "react";

import AutoLoadMore from "coral-admin/components/AutoLoadMore";
import { useToggleState } from "coral-framework/hooks";
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
} from "coral-ui/components/v2";
import { TextArea } from "coral-ui/components/v3";

import styles from "./PaginatedSelect.css";

interface Props {
  onLoadMore?: () => void;
  onFilter?: (filter: string) => void;
  label: string;
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
  label,
}) => {
  const filterRef = useRef<HTMLTextAreaElement>(null);

  const [isPopoverVisible, setIsPopoverVisible, togglePopoverVisible] =
    useToggleState(false);

  useEffect(() => {
    if (isPopoverVisible && filterRef.current) {
      filterRef.current.focus();
    }
  }, [isPopoverVisible]);

  const handleButtonBlur = useCallback(() => {
    if (!onFilter) {
      return;
    }
    setIsPopoverVisible(false);
  }, [onFilter, setIsPopoverVisible]);

  return (
    <ClickOutside onClickOutside={() => setIsPopoverVisible(false)}>
      <Popover
        id=""
        placement="bottom-end"
        modifiers={{ arrow: { enabled: false }, offset: { offset: "0, 4" } }}
        visible={isPopoverVisible}
        body={
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
        }
      >
        {({ ref }) => (
          <Flex
            className={cn(styles.button, className)}
            onClick={() => setIsPopoverVisible(true)}
            ref={ref}
            justifyContent="space-between"
            aria-label={label}
          >
            {Icon && (
              <ButtonSvgIcon className={styles.buttonIconLeft} Icon={Icon} />
            )}
            {isPopoverVisible && !!onFilter ? (
              <Localized
                id="admin-paginatedSelect-filter"
                attrs={{ "aria-label": true }}
              >
                <TextArea
                  className={styles.filterInput}
                  onChange={(e) => onFilter(e.target.value)}
                  ref={filterRef}
                  aria-label="Filter results"
                />
              </Localized>
            ) : (
              <Flex
                alignItems="center"
                aria-roledescription="button"
                tabIndex={0}
                onFocus={() => setIsPopoverVisible(true)}
                onBlur={handleButtonBlur}
              >
                {selected}
              </Flex>
            )}
            {
              <ButtonSvgIcon
                className={styles.buttonIconRight}
                Icon={isPopoverVisible ? ArrowsUpIcon : ArrowsDownIcon}
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePopoverVisible();
                }}
              />
            }
          </Flex>
        )}
      </Popover>
    </ClickOutside>
  );
};

export default PaginatedSelect;

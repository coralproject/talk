import cn from "classnames";
import { noop } from "lodash";
import React, {
  ComponentType,
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
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

import { Localized } from "@fluent/react/compat";
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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && filterRef.current) {
      filterRef.current.focus();
    }
  }, [open]);

  const handleButtonClick = useCallback(() => {
    setOpen(true);
  }, []);

  const handleOutsideClick = useCallback((event?: MouseEvent | undefined) => {
    setOpen(false);
  }, []);

  return (
    <ClickOutside onClickOutside={handleOutsideClick}>
      <Popover
        id=""
        placement="bottom-end"
        modifiers={{ arrow: { enabled: false }, offset: { offset: "0, 4" } }}
        visible={open}
        body={({ toggleVisibility }) => (
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
        {({ toggleVisibility, ref }) => (
          <Flex
            className={cn(styles.button, className)}
            onClick={handleButtonClick}
            ref={ref}
            justifyContent="space-between"
          >
            {Icon && (
              <ButtonSvgIcon className={styles.buttonIconLeft} Icon={Icon} />
            )}
            {open && !!onFilter ? (
              <Localized id="admin-paginatedSelect-filter">
                <TextField
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
                  // display: open && !!onFilter ? "none" : "inherit",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                role="button"
                tabIndex={0}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
              >
                {selected}
              </Flex>
            )}
            {!open && (
              <ButtonSvgIcon
                className={styles.buttonIconRight}
                Icon={ArrowsDownIcon}
                size="xs"
              />
            )}
            {open && (
              <ButtonSvgIcon
                className={styles.buttonIconRight}
                Icon={ArrowsUpIcon}
                size="xs"
              />
            )}
          </Flex>
        )}
      </Popover>
    </ClickOutside>
  );
};

export default PaginatedSelect;

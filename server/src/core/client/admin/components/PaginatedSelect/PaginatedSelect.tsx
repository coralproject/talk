import cn from "classnames";
import { noop } from "lodash";
import React, { FunctionComponent } from "react";

import AutoLoadMore from "coral-admin/components/AutoLoadMore";
import { IntersectionProvider } from "coral-framework/lib/intersection";
import {
  Button,
  ButtonIcon,
  ClickOutside,
  Dropdown,
  Flex,
  Popover,
  Spinner,
} from "coral-ui/components/v2";

import styles from "./PaginatedSelect.css";

interface Props {
  onLoadMore?: () => void;
  icon?: string;
  hasMore?: boolean;
  disableLoadMore?: boolean;
  loading?: boolean;
  selected: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

const PaginatedSelect: FunctionComponent<Props> = ({
  onLoadMore = noop,
  disableLoadMore = false,
  hasMore = false,
  loading = false,
  children,
  icon,
  selected,
  className,
}) => {
  return (
    <Popover
      id=""
      placement="bottom-end"
      modifiers={{ arrow: { enabled: false }, offset: { offset: "0, 4" } }}
      body={({ toggleVisibility }) => (
        <ClickOutside onClickOutside={toggleVisibility}>
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
        </ClickOutside>
      )}
    >
      {({ toggleVisibility, ref, visible }) => (
        <Button
          className={cn(styles.button, className)}
          variant="flat"
          adornmentLeft
          color="mono"
          onClick={toggleVisibility}
          ref={ref}
          uppercase={false}
        >
          {icon && (
            <ButtonIcon className={styles.buttonIconLeft}>{icon}</ButtonIcon>
          )}
          <Flex alignItems="center" className={styles.wrapper}>
            {selected}
          </Flex>
          {!visible && (
            <ButtonIcon className={styles.buttonIconRight}>
              keyboard_arrow_down
            </ButtonIcon>
          )}
          {visible && (
            <ButtonIcon className={styles.buttonIconRight}>
              keyboard_arrow_up
            </ButtonIcon>
          )}
        </Button>
      )}
    </Popover>
  );
};

export default PaginatedSelect;

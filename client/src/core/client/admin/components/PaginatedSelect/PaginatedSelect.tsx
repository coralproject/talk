/* eslint-disable */
import cn from "classnames";
import { noop } from "lodash";
import React, { ComponentType, FunctionComponent, useCallback, useState } from "react";

import AutoLoadMore from "coral-admin/components/AutoLoadMore";
import { IntersectionProvider } from "coral-framework/lib/intersection";
import {
  ArrowsDownIcon,
  ArrowsUpIcon,
  ButtonSvgIcon,
} from "coral-ui/components/icons";
import {
  Button,
  ClickOutside,
  Dropdown,
  Flex,
  Popover,
  Spinner,
  TextField,
} from "coral-ui/components/v2";

import styles from "./PaginatedSelect.css";

interface Props {
  onLoadMore?: () => void;
  Icon?: ComponentType;
  hasMore?: boolean;
  disableLoadMore?: boolean;
  loading?: boolean;
  selected: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

enum Mode {
  SELECT,
  FILTER
}

const PaginatedSelect: FunctionComponent<Props> = ({
  onLoadMore = noop,
  disableLoadMore = false,
  hasMore = false,
  loading = false,
  children,
  Icon,
  selected,
  className,
}) => {
  const [mode, setMode] = useState<Mode>(Mode.SELECT);
  const [visible, setVisible] = useState(false);

  const handleClick = useCallback((inside: boolean) => {
    console.log("HANDLE CLICK", { mode, visible, inside });
    if (inside) {
      if (!visible) {
        console.log("setting visibility");
        setVisible(true);
      } else {
        console.log("changing mode to filter");
        setMode(Mode.FILTER);
      }
    } else {
      setMode(Mode.SELECT);
      setVisible(false);
    }
  }, [visible, mode]);

  return (
    <Popover
      id=""
      placement="bottom-end"
      modifiers={{ arrow: { enabled: false }, offset: { offset: "0, 4" } }}
      visible={visible}
      body={({ toggleVisibility }) => (
        <ClickOutside onClickOutside={() => { console.log("outer"); handleClick(false) }}>
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
        <Flex
          className={cn(styles.button, className)}
          onClick={(e) => { console.log("inner"); e.stopPropagation(); handleClick(true) }}
          ref={ref}
          justifyContent="space-between"
        >
          {Icon && (
            <ButtonSvgIcon className={styles.buttonIconLeft} Icon={Icon} />
          )}
          {mode === Mode.SELECT && (
            <Flex alignItems="center" className={styles.wrapper}>
              {selected}
            </Flex>
          )}
          {mode === Mode.FILTER && (
            <TextField

            />
          )}
          {!visible && (
            <ButtonSvgIcon
              className={styles.buttonIconRight}
              Icon={ArrowsDownIcon}
              size="xs"
            />
          )}
          {visible && (
            <ButtonSvgIcon
              className={styles.buttonIconRight}
              Icon={ArrowsUpIcon}
              size="xs"
            />
          )}
        </Flex>
      )}
    </Popover>
  );
};

export default PaginatedSelect;

/* eslint-disable */
import cn from "classnames";
import { noop } from "lodash";
import React, { ComponentType, FunctionComponent, useCallback, useRef, useState } from "react";

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
  const buttonRef = useRef<HTMLDivElement>();
  const dropdownRef = useRef(null);
  const [mode, setMode] = useState<Mode>(Mode.SELECT);
  const [visible, setVisible] = useState(false);

  const handleButtonClick = useCallback(() => {
    console.log("handling button click");
    if (!visible) {
      console.log("currently closed, opening");
      setVisible(true);
    } else {
      console.log("already open, entering filter mode");
      setMode(Mode.FILTER);
    }
  }, [mode, visible]);

  const handleOutsideClick = useCallback((event?: MouseEvent | undefined) => {
    console.log("handling click outside of dropdown", { event, buttonRef });
    if (event?.target && buttonRef.current && buttonRef.current?.contains(event.target as Node)) {
      console.log("Click was on button");
      return;
    }

    console.log("click was not on button, closing");
    setMode(Mode.FILTER);
    setVisible(false);
  }, [mode, visible, buttonRef.current]);

  console.log("fina render", { mode, visible });
  return (
    <Popover
      id=""
      placement="bottom-end"
      modifiers={{ arrow: { enabled: false }, offset: { offset: "0, 4" } }}
      visible={visible}
      body={({ toggleVisibility }) => (
        <ClickOutside onClickOutside={handleOutsideClick}>
          <IntersectionProvider>
            <Dropdown className={styles.dropdown} ref={dropdownRef}>
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
          onClick={handleButtonClick}
          ref={buttonRef as unknown as any}
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

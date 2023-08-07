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

enum Mode {
  SELECT,
  FILTER,
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
  const [mode, setMode] = useState<Mode>(Mode.SELECT);
  const [visible, setVisible] = useState(false);

  const handleButtonClick = useCallback(() => {
    if (!visible) {
      setVisible(true);
    } else if (onFilter) {
      setMode(Mode.FILTER);
    } else {
      setVisible(false);
    }
  }, [visible, onFilter]);

  useEffect(() => {
    if (mode === Mode.FILTER && filterRef.current) {
      filterRef.current.focus();
    }
  }, [mode]);

  const handleOutsideClick = useCallback((event?: MouseEvent | undefined) => {
    setMode(Mode.SELECT);
    setVisible(false);
  }, []);

  return (
    <ClickOutside onClickOutside={handleOutsideClick}>
      <Popover
        id=""
        placement="bottom-end"
        modifiers={{ arrow: { enabled: false }, offset: { offset: "0, 4" } }}
        visible={visible}
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
            {mode === Mode.SELECT && (
              <Flex alignItems="center" className={styles.wrapper}>
                {selected}
              </Flex>
            )}
            {!!onFilter && mode === Mode.FILTER && (
              <TextField
                onChange={(e) => onFilter(e.target.value)}
                ref={filterRef}
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
    </ClickOutside>
  );
};

export default PaginatedSelect;

import cn from "classnames";
import React, { FunctionComponent, ReactElement, useCallback } from "react";

import { Flex } from "coral-ui/components/v2";

import styles from "./TileSelector.css";

export interface SelectorChildProps {
  id?: string;
  name?: string;
  value?: any;
  checked?: boolean;
  onChange?: React.EventHandler<React.ChangeEvent<HTMLInputElement>>;
}

interface Props {
  id: string;
  name: string;
  onChange?: (value: any) => void;
  value?: string;
  className?: string;
  children: Array<ReactElement<SelectorChildProps, any>>;
}

const TileSelector: FunctionComponent<Props> = (props) => {
  const { id, name, value, className, children, onChange } = props;
  const onItemChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) =>
      onChange && onChange(evt.target.value),
    [onChange]
  );
  return (
    <Flex
      className={cn(className, styles.root)}
      itemGutter="half"
      alignItems="stretch"
    >
      {React.Children.map(
        children,
        (c: ReactElement<SelectorChildProps, any>, i) =>
          React.cloneElement(c, {
            id: `${id}-${i}`,
            name,
            checked: c.props.value === value,
            onChange: onItemChange,
          })
      )}
    </Flex>
  );
};

export default TileSelector;

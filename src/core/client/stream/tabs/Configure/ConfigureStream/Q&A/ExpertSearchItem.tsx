import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";

import { Button, Flex } from "coral-ui/components";

interface Props {
  id: string;
  username: string | null;
  email: string | null;
  onClickAdd: (id: string) => void;
}

const ExpertSearchItem: FunctionComponent<Props> = ({
  id,
  username,
  email,
  onClickAdd,
}) => {
  const onClick = useCallback(() => {
    onClickAdd(id);
  }, [id, onClickAdd]);

  return (
    <div key={id}>
      <Flex alignItems="center" justifyContent="center">
        {email ? <span>{email}</span> : null}
        {email && username ? <span> - </span> : null}
        {username ? <span>{username}</span> : null}
        <Button onClick={onClick}>
          <Localized id="configure-experts-add-button">Add</Localized>
        </Button>
      </Flex>
    </div>
  );
};

export default ExpertSearchItem;

import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";

import { Button, Flex } from "coral-ui/components";

interface Props {
  id: string;
  username: string | null;
  email: string | null;
  onClickRemove: (id: string) => void;
}

const ExpertListItem: FunctionComponent<Props> = ({
  id,
  username,
  email,
  onClickRemove,
}) => {
  const onClick = useCallback(() => {
    onClickRemove(id);
  }, [id, onClickRemove]);

  return (
    <div key={id}>
      <Flex alignItems="center" justifyContent="center">
        {email ? <span>{email}</span> : null}
        {email && username ? <span> - </span> : null}
        {username ? <span>{username}</span> : null}
        <Button onClick={onClick}>
          <Localized id="configure-experts-remove-button">Remove</Localized>
        </Button>
      </Flex>
    </div>
  );
};

export default ExpertListItem;

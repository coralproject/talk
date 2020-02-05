import React, { FunctionComponent, useCallback } from "react";

import { Button, Flex } from "coral-ui/components";

interface Props {
  id: string;
  username: string | null;
  email: string | null;
  onClickAdd: (
    id: string,
    username: string | null,
    email: string | null
  ) => void;
}

const ExpertSearchItem: FunctionComponent<Props> = ({
  id,
  username,
  email,
  onClickAdd,
}) => {
  const onClick = useCallback(() => {
    onClickAdd(id, username, email);
  }, [id, username, email, onClickAdd]);

  return (
    <div key={id}>
      <Flex alignItems="center">
        <Button onClick={onClick}>
          {email && username && (
            <span>
              {email}
              {` (${username})`}
            </span>
          )}
          {email && !username && <span>{email}</span>}
        </Button>
      </Flex>
    </div>
  );
};

export default ExpertSearchItem;

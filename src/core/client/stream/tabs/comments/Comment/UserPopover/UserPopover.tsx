import { Localized } from "fluent-react/compat";
import React from "react";
import { FunctionComponent } from "react";

import {
  Button,
  Flex,
  HorizontalGutter,
  Typography,
} from "coral-ui/components";
import Username from "../Username";

interface Props {
  username: React.ReactNode;
  createdAt: string;
}

const UserPopover: FunctionComponent<Props> = props => {
  return (
    <HorizontalGutter spacing={3}>
      <HorizontalGutter spacing={2}>
        <div>
          <Username>{props.username}</Username>
        </div>
        <Localized
          id="comments-userPopover-memberSince"
          $timestamp={props.createdAt}
        >
          <Typography variant="detail" container="div">
            Member since: {props.createdAt}
          </Typography>
        </Localized>
      </HorizontalGutter>
      <Flex justifyContent="flex-end">
        <Button variant="outlined" size="small">
          Ignore
        </Button>
      </Flex>
    </HorizontalGutter>
  );
};

export default UserPopover;

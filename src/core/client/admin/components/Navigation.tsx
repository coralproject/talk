import React, { StatelessComponent } from "react";
import { Button, Flex, Typography } from "talk-ui/components";

export interface AppProps {
  goToModerate: () => void;
  goToCommunity: () => void;
  goToStories: () => void;
  goToConfigure: () => void;
}

const Navigation: StatelessComponent<AppProps> = ({
  goToModerate,
  goToCommunity,
  goToStories,
  goToConfigure,
}) => (
  <Flex itemGutter="double">
    <Typography variant="heading1">Talk</Typography>
    <Button onClick={goToModerate}>Moderate</Button>
    <Button onClick={goToCommunity}>Community</Button>
    <Button onClick={goToStories}>Stories</Button>
    <Button onClick={goToConfigure}>Configure</Button>
  </Flex>
);

export default Navigation;

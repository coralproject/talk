import React, { StatelessComponent } from "react";
import { HorizontalGutter } from "talk-ui/components";
import NavigationContainer from "../containers/NavigationContainer";

const App: StatelessComponent = ({ children }) => (
  <HorizontalGutter>
    <NavigationContainer />
    {children}
  </HorizontalGutter>
);

export default App;

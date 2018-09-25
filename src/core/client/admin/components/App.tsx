import React, { StatelessComponent } from "react";
import { HorizontalGutter } from "talk-ui/components";
import NavigationContainer from "../containers/NavigationContainer";

export type View =
  | "MODERATE"
  | "COMMUNITY"
  | "STORIES"
  | "CONFIGURE"
  | "%future added value";

export interface AppProps {
  view: View;
}

const renderView = (view: View) => {
  switch (view) {
    case "MODERATE":
      return <div>MODERATE</div>;
    case "COMMUNITY":
      return <div>COMMUNITY</div>;
    case "STORIES":
      return <div>STORIES</div>;
    case "CONFIGURE":
      return <div>CONFIGURE</div>;
    default:
      throw new Error(`Unknown view ${view}`);
  }
};

const App: StatelessComponent<AppProps> = ({ view }) => (
  <HorizontalGutter>
    <NavigationContainer />
    {renderView(view)}
  </HorizontalGutter>
);

export default App;

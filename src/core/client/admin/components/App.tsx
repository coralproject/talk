import React, { StatelessComponent } from "react";

export type View = "MODERATE" | "%future added value";

export interface AppProps {
  view: View;
}

const renderView = (view: View) => {
  switch (view) {
    case "MODERATE":
      return <div>Moderate</div>;
    default:
      throw new Error(`Unknown view ${view}`);
  }
};

const App: StatelessComponent<AppProps> = ({ view }) => (
  <div>{renderView(view)}</div>
);

export default App;

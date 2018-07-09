import React, { StatelessComponent } from "react";

export interface IndentProps {
  level?: number;
  children: React.ReactNode;
}

const Indent: StatelessComponent<IndentProps> = props => {
  return (
    <div style={{ marginLeft: "16px", marginTop: "8px", marginBottom: "8px" }}>
      {props.children}
    </div>
  );
};

export default Indent;

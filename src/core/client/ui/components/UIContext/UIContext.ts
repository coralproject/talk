import React from "react";
import { Formatter } from "react-timeago";

export interface UIContext {
  timeagoFormatter: Formatter;
}

const UIContext = React.createContext<UIContext>({} as any);

export default UIContext;

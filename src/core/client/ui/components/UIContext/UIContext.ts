import React from "react";
import { MediaQueryMatchers } from "react-responsive";
import { Formatter } from "react-timeago";

export interface UIContextProps {
  timeagoFormatter?: Formatter | null;
  mediaQueryValues?: Partial<MediaQueryMatchers>;
}

const UIContext = React.createContext<UIContextProps>({} as any);

export default UIContext;

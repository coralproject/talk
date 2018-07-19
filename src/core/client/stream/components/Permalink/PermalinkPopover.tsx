import { Manager, Popper, Reference } from "react-popper";

import Popover from "./Popover";

const PermalinkPopover = ({ id, show, style }) => (
  <Popover id={id} style={style}>
    <Textfield /> Copy
  </Popover>
);

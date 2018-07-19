const Popover = ({
  id,
  style,
  children,
  visible,
  onClose,
  firstFocusable,
  lastFocusable,
}) => <div aria-role="dialog">{children}</div>;

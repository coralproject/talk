import { DecoratorLegacy } from "./types";

const withClickEvent: DecoratorLegacy = (pym) => {
  const handleClick = () => pym.sendMessage("click", "");

  // If the user clicks outside the embed, then tell the embed.
  document.addEventListener("click", handleClick, true);

  // Return cleanup callback.
  return () => {
    // Remove the event listeners.
    document.removeEventListener("click", handleClick, true);
  };
};

export default withClickEvent;

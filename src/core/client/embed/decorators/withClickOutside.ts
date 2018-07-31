import { Decorator } from "./";

const withClickOutside: Decorator = (pym: any) => {
  const handleClick = () => pym.sendMessage("click");

  // If the user clicks outside the embed, then tell the embed.
  document.addEventListener("click", handleClick, true);

  // Return cleanup callback.
  return () => {
    // Remove the event listeners.
    document.removeEventListener("click", handleClick);
  };
};

export default withClickOutside;

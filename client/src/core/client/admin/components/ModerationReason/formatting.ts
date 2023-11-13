export const unsnake = (code: string): string => {
  const parts = code.split("_");
  return parts
    .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

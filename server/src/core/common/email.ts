export const extractDomain = (email: string): string => {
  const parts = email.split("@");

  return parts.length > 1 ? parts[1] : "";
};

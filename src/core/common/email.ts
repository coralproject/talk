export const extractDomain = (email: string): string => {
  const domain = email.split("@")[1];

  return domain;
};

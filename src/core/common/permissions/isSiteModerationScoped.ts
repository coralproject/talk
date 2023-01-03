export interface UserModerationScopes {
  siteIDs?: Readonly<string[]> | null;
  sites?: Readonly<any[]> | null;
}

export function isSiteModerationScoped(
  moderationScopes?: Readonly<UserModerationScopes> | null
): moderationScopes is Required<UserModerationScopes> {
  const scopeSites = moderationScopes?.siteIDs || moderationScopes?.sites;

  return !!scopeSites && scopeSites.length > 0;
}

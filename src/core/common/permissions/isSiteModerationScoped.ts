export interface UserModerationScopes {
  siteIDs?: string[];
  sites?: any[];
}

export function isSiteModerationScoped(
  moderationScopes?: UserModerationScopes | null
): moderationScopes is Required<UserModerationScopes> {
  const scopeSites = moderationScopes?.siteIDs || moderationScopes?.sites;

  return !!scopeSites && scopeSites.length > 0;
}

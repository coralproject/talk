import { GQLAuthIntegrations } from "../schema/__generated__/types";

interface Integration {
  enabled: boolean;
  targetFilter: {
    admin?: boolean;
    stream?: boolean;
  };
}

interface AuthSettings {
  integrations: {
    [index: string]: Integration;
  };
}

export default function enabledAuthenticationIntegrations(
  auth: AuthSettings,
  target?: "stream" | "admin"
): string[] {
  if (auth.integrations) {
    return Object.keys(auth.integrations).filter(
      (key: keyof GQLAuthIntegrations) => {
        const { targetFilter, enabled } = auth.integrations[key];
        if (target) {
          return enabled && targetFilter[target];
        }
        return enabled && targetFilter.admin && targetFilter.stream;
      }
    );
  }
  return [];
}

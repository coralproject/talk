import getModerationLink, {
  Options,
} from "coral-framework/helpers/getModerationLink";
import { useCoralContext } from "coral-framework/lib/bootstrap";

/**
 * useModerationLink is a react hook that returns an url to moderation.
 */
export default function useModerationLink<T>(options: Options): string {
  const { rootURL } = useCoralContext();
  return rootURL + getModerationLink(options);
}

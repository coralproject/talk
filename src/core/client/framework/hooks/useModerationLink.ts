import getModerationLink, {
  Options,
} from "coral-framework/helpers/getModerationLink";
import { useCoralContext } from "coral-framework/lib/bootstrap";

/**
 * usePrevious is a react hook that will return the
 * previous value.
 */
export default function useModerationLink<T>(options: Options): string {
  const { rootURL } = useCoralContext();
  return rootURL + getModerationLink(options);
}

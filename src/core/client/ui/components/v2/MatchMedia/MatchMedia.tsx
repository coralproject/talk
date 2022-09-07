import React, {
  FunctionComponent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import Responsive, { MediaQueryMatchers } from "react-responsive";

import usePrevious from "coral-framework/hooks/usePrevious";
import { UIContext } from "coral-ui/components/v2";
import { useShadowRoot } from "coral-ui/encapsulation";
import getShadowRootWidth from "coral-ui/encapsulation/getShadowRootWidth";
import onShadowRootWidthChange, {
  ShadowRootWidthChangeCallback,
} from "coral-ui/encapsulation/onShadowRootWidthChange";
import breakpoints from "coral-ui/theme/breakpoints";
import { PropTypesOf } from "coral-ui/types";

type Breakpoints = keyof typeof breakpoints;

interface Props {
  /** greater than or equal width. */
  gteWidth?: Breakpoints;

  /** greater than width. */
  gtWidth?: Breakpoints;

  /** less than equals width. */
  lteWidth?: Breakpoints;

  /** less than equals width. */
  ltWidth?: Breakpoints;

  /** greater than or equal device width. */
  gteDeviceWidth?: Breakpoints;

  /** greater than device width. */
  gtDeviceWidth?: Breakpoints;

  /** less than equals device width. */
  lteDeviceWidth?: Breakpoints;

  /** less than equals device width. */
  ltDeviceWidth?: Breakpoints;

  children: ReactNode | ((matches: boolean) => React.ReactNode);
  className?: string;
  component?:
    | string
    | React.FC<any>
    | React.ClassType<any, any, any>
    | React.ComponentClass<any>;
  all?: boolean;
  print?: boolean;
  screen?: boolean;
  speech?: boolean;
  values?: Partial<MediaQueryMatchers>;
}

function matchWidth(
  width: number,
  minWidth: number | undefined,
  maxWidth: number | undefined
): boolean | null {
  if (minWidth === undefined && maxWidth === undefined) {
    return null;
  }
  if (minWidth && width < minWidth) {
    return false;
  }
  if (maxWidth && width > maxWidth) {
    return false;
  }
  return true;
}

/**
 * checks whether the shadow dom root matches the query or not.
 * Return true, false, or null when either not in shadow dom or no
 * relevant query parmeters.
 */
function matchMediaShadow(
  shadowRoot: ShadowRoot | null,
  minWidth: number | undefined,
  maxWidth: number | undefined
): boolean | null {
  if (minWidth === undefined && maxWidth === undefined) {
    return null;
  }
  if (!shadowRoot) {
    return null;
  }
  const width = getShadowRootWidth(shadowRoot);
  if (width === null) {
    return null;
  }
  return matchWidth(width, minWidth, maxWidth);
}

/**
 * Hook that checks whether the shadow dom root matches the query or not.
 * Return true, false, or null when either not in shadow dom or no
 * relevant query parmeters.
 */
function useShadowRootMediaMatcher(
  minWidth: number | undefined,
  maxWidth: number | undefined
) {
  const prevMinWidth = usePrevious(minWidth, null);
  const prevMaxWidth = usePrevious(maxWidth, null);
  const resultRef = useRef<boolean | null | undefined>(undefined);
  const [, setRerender] = useState(0);
  const rerender = () => setRerender((c) => c + 1);
  const shadowRoot = useShadowRoot();

  useEffect(() => {
    if (!shadowRoot || (minWidth === undefined && maxWidth === undefined)) {
      return;
    }
    const callback: ShadowRootWidthChangeCallback = (width: number) => {
      const result = matchWidth(width, minWidth, maxWidth);
      if (resultRef.current !== result) {
        resultRef.current = result;
        rerender();
      }
    };
    return onShadowRootWidthChange(shadowRoot, callback);
  }, [shadowRoot, minWidth, maxWidth]);

  const minWidthChanged = prevMinWidth !== null && prevMinWidth !== minWidth;
  const maxWidthChanged = prevMaxWidth !== null && prevMaxWidth !== maxWidth;
  const queryChanged = minWidthChanged || maxWidthChanged;

  if (resultRef.current === undefined || queryChanged) {
    resultRef.current = matchMediaShadow(shadowRoot, minWidth, maxWidth);
  }
  return resultRef.current;
}

export const MatchMedia: FunctionComponent<Props> = (props) => {
  const {
    speech,
    gteWidth,
    gtWidth,
    lteWidth,
    ltWidth,
    gteDeviceWidth,
    gtDeviceWidth,
    lteDeviceWidth,
    ltDeviceWidth,
    ...rest
  } = props;
  const minMaxWidth = {
    minWidth: gtWidth
      ? breakpoints[gtWidth] + 1
      : gteWidth
      ? breakpoints[gteWidth]
      : undefined,
    maxWidth: ltWidth
      ? breakpoints[ltWidth] - 1
      : lteWidth
      ? breakpoints[lteWidth]
      : undefined,
  };
  const mapped = {
    // TODO: Temporarily map newer speech to older aural type until
    // react-responsive supports the speech prop.
    aural: speech,
    minDeviceWidth: gtDeviceWidth
      ? breakpoints[gtDeviceWidth] + 1
      : gteDeviceWidth
      ? breakpoints[gteDeviceWidth]
      : undefined,
    maxDeviceWidth: ltDeviceWidth
      ? breakpoints[ltDeviceWidth] - 1
      : lteDeviceWidth
      ? breakpoints[lteDeviceWidth]
      : undefined,
  };

  // Try the shadow root media matcher.
  const matched = useShadowRootMediaMatcher(
    minMaxWidth.minWidth,
    minMaxWidth.maxWidth
  );
  if (matched === true) {
    const hasOtherQueryParts = Object.keys(mapped).find(
      (key: keyof typeof mapped) => mapped[key] !== undefined
    );
    if (hasOtherQueryParts) {
      // Run rest of query parameters through react-responsive.
      return <Responsive {...rest} {...mapped} />;
    }
    if (typeof props.children === "function") {
      return (props.children as any)(true);
    }
    return props.children;
  } else if (matched === false) {
    if (typeof props.children === "function") {
      return (props.children as any)(false);
    }
    return null;
  }

  // Invalid or not in shadow root:
  // Return regular react-responsive element.
  return <Responsive {...rest} {...mapped} {...minMaxWidth} />;
};

const MatchMediaWithContext: FunctionComponent<Props> = (props) => (
  <UIContext.Consumer>
    {({ mediaQueryValues }) => (
      <MatchMedia {...props} values={mediaQueryValues} />
    )}
  </UIContext.Consumer>
);

export default MatchMediaWithContext;
export type MatchMediaProps = PropTypesOf<typeof MatchMediaWithContext>;

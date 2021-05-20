import { useEffect, useState } from "react";

export default function useColdStart(period = 1000) {
  // We define a period at the beginning as cold start, where
  // different state might not yet be stable.
  const [coldStart, setColdStart] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setColdStart(false);
    }, period);
    return () => {
      clearTimeout(timeout);
    };
  }, []);
  return coldStart;
}

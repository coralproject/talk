import { useEffect, useState } from "react";

import { useIntersectionContext } from "./IntersectionContext";

const useInView = () => {
  const { observe } = useIntersectionContext();
  const [intersectionRef, setIntersectionRef] = useState<Element | null>(null);
  const [inView, setInView] = useState<boolean>(false);

  useEffect(() => {
    if (!intersectionRef) {
      return;
    }

    // Begin observing te ref element. This will return a function for
    // unobserving the element.
    return observe(intersectionRef, ({ intersectionRatio }) => {
      // We will use the intersection ratio. Once the ratio is greater than zero
      // we will mark that the element is in view.
      setInView(intersectionRatio > 0);
    });
  }, [intersectionRef, observe]);

  return { inView, intersectionRef: setIntersectionRef };
};

export default useInView;

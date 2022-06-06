import { useEffect, useState } from "react";

import { useIntersectionContext } from "./IntersectionContext";

const useInView = () => {
  const { observe } = useIntersectionContext();
  const [intersectionRef, setIntersectionRef] = useState<Element | null>(null);
  const [inView, setInView] = useState<boolean>(false);
  const [previousY, setPreviousY] = useState<number | null>(null);
  const [scrolledUpOutOfView, setScrolledUpOutOfView] = useState<boolean>(
    false
  );

  useEffect(() => {
    if (!intersectionRef) {
      return;
    }

    // Begin observing te ref element. This will return a function for
    // unobserving the element.
    return observe(
      intersectionRef,
      ({ intersectionRatio, boundingClientRect }) => {
        const currentY = boundingClientRect.y;
        // If the current and previous Y are both negative, and the current is larger
        // than the previous, and the element is no longer in view, and the element is not
        // already marked as having been scrolled up, then we know that the element has been
        // scrolled up and out of view for the first time.
        if (
          previousY &&
          currentY < 0 &&
          previousY < 0 &&
          Math.abs(currentY) > Math.abs(previousY) &&
          !scrolledUpOutOfView &&
          !inView
        ) {
          setScrolledUpOutOfView(true);
        }
        // We will use the intersection ratio. Once the ratio is greater than zero
        // we will mark that the element is in view.
        setInView(intersectionRatio > 0);
        setPreviousY(currentY);
      }
    );
  }, [intersectionRef, observe, scrolledUpOutOfView, previousY]);

  return { inView, intersectionRef: setIntersectionRef, scrolledUpOutOfView };
};

export default useInView;

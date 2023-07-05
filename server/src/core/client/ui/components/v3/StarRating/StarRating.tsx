import cn from "classnames";
import React, {
  ChangeEvent,
  FocusEventHandler,
  FunctionComponent,
  MouseEvent,
  MouseEventHandler,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import { roundRating } from "coral-common/utils";
import { useUUID } from "coral-framework/hooks";
import CLASSES from "coral-stream/classes";

import StarRatingIcon from "./StarRatingIcon";

import styles from "./StarRating.css";

interface Props {
  className?: string;
  rating: number;
  precision?: number;
  name?: string;
  onRate?: (rating: number) => void;
  size?: "lg" | "xl";
}

const STARS = [1, 2, 3, 4, 5];

const StarRating: FunctionComponent<Props> = ({
  name,
  className,
  rating: currentRating,
  precision = 0,
  onRate,
  size = "lg",
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const uuid = useUUID();
  const [hoverRating, setHoverRating] = useState(0);

  const onBlur: FocusEventHandler = useCallback(() => {
    setHoverRating(0);
  }, []);

  const onFocus: FocusEventHandler<HTMLInputElement> = useCallback((event) => {
    const value = parseInt(event.currentTarget.value, 10);

    setHoverRating(value);
  }, []);

  const onMouseMove: MouseEventHandler = (event) => {
    if (!ref.current) {
      return;
    }

    const { left, right } = ref.current.getBoundingClientRect();
    const { clientX } = event;

    const value = Math.ceil(5 * ((clientX - left) / (right - left)));

    setHoverRating(value);
  };

  const onMouseLeave: MouseEventHandler = () => {
    setHoverRating(0);
  };

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLInputElement>) => {
      const target = event.target as HTMLInputElement;
      const value = parseInt(target.value, 10);

      if (onRate) {
        onRate(value);
      }

      setHoverRating(0);
    },
    [onRate]
  );

  const readOnly = !name || !onRate;

  const rating = useMemo(() => {
    if (!readOnly && hoverRating) {
      return hoverRating;
    }

    return roundRating(currentRating, precision);
  }, [currentRating, hoverRating, precision, readOnly]);

  const stars = useMemo(() => {
    const props = {
      readOnly,
      name,
      onFocus: !readOnly ? onFocus : undefined,
      onBlur: !readOnly ? onBlur : undefined,
      onChange: !readOnly ? onChange : undefined,
      onClick: !readOnly ? onChange : undefined,
    };

    return STARS.map((star) => {
      return (
        <StarRatingIcon
          id={`${uuid}-${star}`}
          key={star}
          checked={star === rating}
          size={size}
          fill={
            rating >= star
              ? "star"
              : rating + 0.5 >= star
              ? "star_half"
              : "star_border"
          }
          value={star}
          {...props}
        />
      );
    });
  }, [name, onBlur, onChange, onFocus, rating, readOnly, size, uuid]);

  if (readOnly) {
    return (
      <span
        className={cn(
          styles.root,
          CLASSES.ratingsAndReview.stars.readonly,
          className
        )}
      >
        {stars}
      </span>
    );
  }

  return (
    <span
      ref={ref}
      className={cn(
        styles.root,
        CLASSES.ratingsAndReview.stars.rating,
        className
      )}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {stars}
    </span>
  );
};

export default StarRating;

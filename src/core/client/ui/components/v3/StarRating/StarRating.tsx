import React, {
  ChangeEvent,
  FocusEventHandler,
  FunctionComponent,
  MouseEvent,
  MouseEventHandler,
  useRef,
  useState,
} from "react";

import { useUUID } from "coral-framework/hooks";

import StarRatingIcon from "./StarRatingIcon";

import styles from "./StarRating.css";

interface Props {
  rating: number;
  name?: string;
  onRate?: (rating: number) => void;
}

const STARS = [1, 2, 3, 4, 5];

const StarRating: FunctionComponent<Props> = ({
  name,
  rating: currentRating,
  onRate,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const uuid = useUUID();
  const [hoverRating, setHoverRating] = useState(0);

  const onBlur: FocusEventHandler = () => {
    setHoverRating(0);
  };

  const onFocus: FocusEventHandler<HTMLInputElement> = (event) => {
    const value = parseInt(event.currentTarget.value, 10);

    setHoverRating(value);
  };

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

  const onChange = (
    event: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLInputElement>
  ) => {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value, 10);

    if (onRate) {
      onRate(value);
    }

    setHoverRating(0);
  };

  const readOnly = !name || !onRate;
  const rating = hoverRating ? hoverRating : currentRating;

  return (
    <span
      ref={ref}
      className={styles.root}
      onMouseMove={!readOnly ? onMouseMove : undefined}
      onMouseLeave={!readOnly ? onMouseLeave : undefined}
    >
      {STARS.map((value) => {
        const checked = value === rating;
        const filled = value <= rating;
        const id = `${uuid}-${value}`;

        return (
          <StarRatingIcon
            key={value}
            id={id}
            name={name}
            readOnly={readOnly}
            checked={checked}
            filled={filled}
            value={value}
            onFocus={!readOnly ? onFocus : undefined}
            onBlur={!readOnly ? onBlur : undefined}
            onChange={!readOnly ? onChange : undefined}
            onClick={!readOnly ? onChange : undefined}
          />
        );
      })}
    </span>
  );
};

export default StarRating;

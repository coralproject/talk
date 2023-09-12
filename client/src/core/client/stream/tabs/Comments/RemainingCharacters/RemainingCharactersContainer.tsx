import React, { FunctionComponent } from "react";

import { getHTMLCharacterLength } from "../helpers";
import RemainingCharacters from "./RemainingCharacters";

interface Props {
  className?: string;
  max: number;
  value: string | undefined;
}

const RemainingCharactersContainer: FunctionComponent<Props> = (props) => {
  return (
    <RemainingCharacters
      className={props.className}
      remaining={props.max - getHTMLCharacterLength(props.value)}
    />
  );
};

export default RemainingCharactersContainer;

import React, { FunctionComponent } from "react";

import RemainingCharacters from "../components/RemainingCharacters";
import { getHTMLCharacterLength } from "../helpers";

interface Props {
  className?: string;
  max: number;
  value: string | undefined;
}

const RemainingCharactersContainer: FunctionComponent<Props> = props => {
  return (
    <RemainingCharacters
      className={props.className}
      remaining={props.max - getHTMLCharacterLength(props.value)}
    />
  );
};

export default RemainingCharactersContainer;

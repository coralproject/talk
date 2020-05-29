import React, { FunctionComponent } from "react";

import OEmbed from "./OEmbed";

interface Props {
  url: string;
}

const TwitterEmbed: FunctionComponent<Props> = ({ url }) => {
  return <OEmbed url={url} type="twitter" />;
};

export default TwitterEmbed;

import React, { FunctionComponent } from "react";

import OEmbed from "./OEmbed";

interface Props {
  url: string;
  width?: string | null;
}

const TwitterEmbed: FunctionComponent<Props> = ({ url, width }) => {
  return <OEmbed url={url} type="twitter" />;
};

export default TwitterEmbed;

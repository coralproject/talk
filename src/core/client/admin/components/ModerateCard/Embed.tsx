import React, { FunctionComponent } from "react";

interface Props {
  url: string;
  type: string;
}

const Embed: FunctionComponent<Props> = ({ url, type }) => {
  const cleanUrl = encodeURIComponent(url);
  return (
    <div>
      <iframe
        frameBorder="0"
        allowFullScreen
        title="oEmbed"
        src={`/api/oembed?type=${type.toLowerCase()}&url=${cleanUrl}`}
      />
    </div>
  );
};

export default Embed;

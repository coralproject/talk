import React, { FunctionComponent } from "react";

interface Props {
  url: string;
  type: string;
}

const Embed: FunctionComponent<Props> = ({ url, type }) => {
  const cleanUrl = encodeURIComponent(url);
  if (type === "GIPHY") {
    return <img src={url} alt="gif" />;
  } else if (type === "YOUTUBE" || type === "TWITTER") {
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
  }
  return null;
};

export default Embed;

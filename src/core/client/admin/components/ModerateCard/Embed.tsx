import React, { FunctionComponent, useCallback, useState } from "react";

import { BaseButton } from "coral-ui/components/v2";

interface Props {
  url: string;
  type: string;
  still: string | null;
}

const Embed: FunctionComponent<Props> = ({ url, type, still }) => {
  const cleanUrl = encodeURIComponent(url);
  const [showAnimated, setShowAnimated] = useState(false);
  const toggleImage = useCallback(() => {
    setShowAnimated(!showAnimated);
  }, [showAnimated]);
  if (type === "GIPHY") {
    return (
      <div>
        <BaseButton onClick={toggleImage}>
          {!showAnimated && still && <img src={still} alt="gif" />}
        </BaseButton>
        {showAnimated && <img src={url} alt="gif" />}
      </div>
    );
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

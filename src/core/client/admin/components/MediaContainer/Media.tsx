import React, { FunctionComponent } from "react";
import ExternalMedia, { Props as ExternalMediaProps } from "./ExternalMedia";
import GiphyMedia, { Props as GiphyMediaProps } from "./GiphyMedia";
import TwitterMedia, { Props as TwitterMediaProps } from "./TwitterMedia";
import YouTubeMedia, { Props as YouTubeMediaProps } from "./YouTubeMedia";

interface Props {
  media:
    | Pick<ExternalMediaProps, "url">
    | GiphyMediaProps
    | Pick<TwitterMediaProps, "url">
    | Pick<YouTubeMediaProps, "url" | "still" | "title">;
  type: "GiphyMedia" | "ExternalMedia" | "YouTubeMedia" | "TwitterMedia";
  id: string;
  siteID: string;
}

const Media: FunctionComponent<Props> = ({ media, type, id, siteID }) => {
  switch (type) {
    case "GiphyMedia":
      return (
        <GiphyMedia
          still={(media as GiphyMediaProps).still}
          video={(media as GiphyMediaProps).video}
          title={(media as GiphyMediaProps).title}
          width={(media as GiphyMediaProps).width}
          height={(media as GiphyMediaProps).height}
        />
      );
    case "ExternalMedia":
      return (
        <ExternalMedia
          id={id}
          url={(media as ExternalMediaProps).url}
          siteID={siteID}
        />
      );
    case "TwitterMedia":
      return (
        <TwitterMedia
          id={id}
          url={(media as TwitterMediaProps).url}
          siteID={siteID}
        />
      );
    case "YouTubeMedia":
      return (
        <YouTubeMedia
          id={id}
          url={(media as YouTubeMediaProps).url}
          siteID={siteID}
          still={(media as YouTubeMediaProps).still}
          title={(media as YouTubeMediaProps).title}
        />
      );
  }
};

export default Media;

import React, { FunctionComponent, useCallback } from "react";
import { useField } from "react-final-form";

import { isMediaLink, MediaLink } from "coral-common/helpers/findMediaLinks";
import { GiphyGif } from "coral-common/rest/external/giphy";

import {
  MediaConfirmPrompt,
  MediaPreview,
} from "../../Comment/MediaConfirmation";
import GifSelector, { GifPreview } from "../../GifSelector";

interface Props {
  showGIFSelector: boolean;
  toggleGIFSelector: () => void;
  siteID: string;
  config: MediaConfig;
  media: MediaLink | null;
  setMedia: (media: MediaLink | null) => void;
}

interface Media {
  type: "giphy" | "twitter" | "youtube";
  url: string;
  id?: string;
}

interface MediaConfig {
  giphy: {
    enabled: boolean;
  };
  twitter: {
    enabled: boolean;
  };
  youtube: {
    enabled: boolean;
  };
}

const MediaField: FunctionComponent<Props> = (props) => {
  const field = useField<Media | undefined>("media", {
    initialValue: undefined,
  });

  const onGIFSelect = useCallback(
    (gif: GiphyGif) => {
      field.input.onChange({
        type: "giphy",
        id: gif.id,
        url: gif.images.original.url,
      });

      props.toggleGIFSelector();
    },
    [props.toggleGIFSelector]
  );

  const onGIFRemove = useCallback(() => {
    field.input.onChange(undefined);
  }, [field.input]);

  const onConfirmMedia = useCallback(() => {
    field.input.onChange(props.media!);
    props.setMedia(null);
  }, [props.media, props.setMedia, field.input]);

  const onRemoveMedia = useCallback(() => {
    field.input.onChange(null);
    props.setMedia(null);
  }, [props.media, props.setMedia, field.input]);

  // Grab the reference to the media object.
  const media = field.input.value;

  return (
    <>
      {props.showGIFSelector && <GifSelector onGifSelect={onGIFSelect} />}
      {props.media && (
        <MediaConfirmPrompt
          media={props.media}
          onConfirm={onConfirmMedia}
          onRemove={onRemoveMedia}
        />
      )}
      {media &&
        media.url &&
        (isMediaLink(media) ? (
          <MediaPreview
            config={props.config}
            media={media}
            siteID={props.siteID}
            onRemove={onRemoveMedia}
          />
        ) : (
          <GifPreview url={media.url} onRemove={onGIFRemove} title="" />
        ))}
    </>
  );
};

export default MediaField;

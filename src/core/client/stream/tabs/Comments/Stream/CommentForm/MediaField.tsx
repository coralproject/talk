import React, { FunctionComponent, useCallback, useEffect } from "react";
import { useField } from "react-final-form";

import { isMediaLink, MediaLink } from "coral-common/helpers/findMediaLinks";
import { GiphyGif } from "coral-common/rest/external/giphy";
import { Icon } from "coral-ui/components/v2";
import { CallOut } from "coral-ui/components/v3";

import {
  MediaConfirmPrompt,
  MediaPreview,
} from "../../Comment/MediaConfirmation";
import ExternalImageInput from "../../ExternalImageInput";
import GifSelector, { GifPreview } from "../../GifSelector";
import { getMediaValidators } from "../../helpers";

export type Widget = "giphy" | "external" | null;

interface Props {
  widget: Widget;
  setWidget: (widget: Widget) => void;
  siteID: string;
  pastedMedia: MediaLink | null;
  setPastedMedia: (media: MediaLink | null) => void;
}

export interface Media {
  id?: string;
  type: "giphy" | "twitter" | "youtube" | "external";
  url: string;
  width?: string;
  height?: string;
}

const MediaField: FunctionComponent<Props> = ({
  widget,
  setWidget,
  siteID,
  pastedMedia,
  setPastedMedia,
}) => {
  const field = useField<Media | undefined>("media", {
    validate: getMediaValidators(),
  });

  // Grab the reference to the media object.
  const media = field.input.value;

  const onSelect = useCallback(
    (selectedMedia: Media | undefined) => {
      field.input.onChange(selectedMedia);
    },
    [field.input]
  );

  const onGIFSelect = useCallback(
    (gif: GiphyGif) =>
      onSelect({
        type: "giphy",
        id: gif.id,
        url: gif.images.original.url,
      }),
    [onSelect]
  );

  const onImageInsert = useCallback(
    (url: string) =>
      onSelect({
        type: "external",
        url,
      }),
    [onSelect]
  );

  const onRemove = useCallback(() => {
    onSelect(undefined);
    setPastedMedia(null);
  }, [onSelect, setPastedMedia]);

  const onConfirmMedia = useCallback(() => {
    // We know that the pastedMedia is provided because the onConfirmMedia is
    // only rendered when the pastedMedia is available.
    field.input.onChange(pastedMedia!);
    setPastedMedia(null);
  }, [field.input, pastedMedia, setPastedMedia]);

  useEffect(() => {
    if (!field.meta.dirty || !field.meta.valid || !widget) {
      return;
    }

    setWidget(null);
  }, [field.meta.valid, field.meta.dirty, setWidget, widget]);

  // This effect will update the selected value if we swap widgets.
  useEffect(() => {
    if (media && widget && media.type !== widget) {
      onSelect(undefined);
    }

    if (pastedMedia && widget) {
      setPastedMedia(null);
    }
  }, [media, onSelect, pastedMedia, setPastedMedia, widget]);

  return (
    <>
      {/* Show the input widget that's selected. */}
      {widget === "giphy" ? (
        <GifSelector onGifSelect={onGIFSelect} />
      ) : widget === "external" ? (
        <ExternalImageInput onImageInsert={onImageInsert} />
      ) : pastedMedia ? (
        <MediaConfirmPrompt
          media={pastedMedia}
          onConfirm={onConfirmMedia}
          onRemove={onRemove}
        />
      ) : null}

      {/* If there's no widget, and we have a valid url, display preview */}
      {!widget && media?.url && field.meta.valid ? (
        isMediaLink(media) ? (
          <MediaPreview media={media} siteID={siteID} onRemove={onRemove} />
        ) : (
          <GifPreview url={media.url} onRemove={onRemove} />
        )
      ) : null}

      {/* Show any errors associated with this field. */}
      {field.meta.error && (
        <CallOut
          color="error"
          title={field.meta.error}
          titleWeight="semiBold"
          icon={<Icon>error</Icon>}
        />
      )}
    </>
  );
};

export default MediaField;

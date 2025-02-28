import React, { FunctionComponent, useCallback, useEffect } from "react";
import { useField } from "react-final-form";

import {
  isMediaLink,
  MediaLink,
} from "coral-common/common/lib/helpers/findMediaLinks";
import { GQLGIF_MEDIA_SOURCE } from "coral-framework/schema";
import { AlertCircleIcon, SvgIcon } from "coral-ui/components/icons";
import { CallOut } from "coral-ui/components/v3";

import { GIF_MEDIA_SOURCE } from "coral-stream/__generated__/MediaSettingsContainer_settings.graphql";

import {
  MediaConfirmPrompt,
  MediaPreview,
} from "../../Comment/MediaConfirmation";
import ExternalImageInput from "../../ExternalImageInput";
import { GifResult } from "../../GifGrid";
import GiphyInput, { GifPreview } from "../../GiphyInput";
import { getMediaValidators } from "../../helpers";
import TenorInput from "../../TenorInput/TenorInput";

export type Widget = "gifs" | "external" | null;

interface GifConfig {
  key: string | null;
  enabled: boolean;
  maxRating: string | null;
  provider?: GIF_MEDIA_SOURCE | null;
}

interface Props {
  widget: Widget;
  setWidget: (widget: Widget) => void;
  siteID: string;
  pastedMedia: MediaLink | null;
  setPastedMedia: (media: MediaLink | null) => void;
  gifConfig: GifConfig;
}

interface Media {
  id?: string;
  type: "giphy" | "tenor" | "twitter" | "bluesky" | "youtube" | "external";
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
  gifConfig,
}) => {
  const {
    input: { value, onChange },
    meta: { valid, dirty, error },
  } = useField<Media | undefined>("media", {
    validate: getMediaValidators(),
  });

  const onGiphySelect = useCallback(
    (gif: GifResult) => {
      onChange({
        type: "giphy",
        id: gif.id,
        url: gif.url,
      });
      setWidget(null);
    },
    [onChange, setWidget]
  );

  const onTenorSelect = useCallback(
    (gif: GifResult) => {
      onChange({
        type: "tenor",
        id: gif.id,
        url: gif.url,
      });
      setWidget(null);
    },
    [onChange, setWidget]
  );

  const onExternalImageSelect = useCallback(
    (url: string) =>
      onChange({
        type: "external",
        url,
      }),
    [onChange]
  );

  const onRemove = useCallback(() => {
    // We use `undefined` here instead of null because `final-form` only treats
    // undefined as truly unset versus `null` which _is_ a value.
    onChange(undefined);
    setPastedMedia(null);
  }, [onChange, setPastedMedia]);

  const onConfirmPastedMedia = useCallback(() => {
    // We know that the pastedMedia is provided because the onConfirmMedia is
    // only rendered when the pastedMedia is available.
    onChange(pastedMedia!);
    setPastedMedia(null);
  }, [onChange, pastedMedia, setPastedMedia]);

  useEffect(() => {
    // If the widget is not open and the field is dirty and invalid, then unset
    // the current value. The user should be seeing a error now, but they closed
    // the widget anyways.
    if (!widget && dirty && !valid) {
      onChange(undefined);
    }

    // If a widget is not open, do nothing. The following checks are designed
    // to interact only when there is a widget open when there shouldn't be or
    // if the current value does not match the open widget.
    if (!widget) {
      return;
    }

    if (value) {
      if (widget === value.type) {
        if (dirty && valid) {
          // When this field is dirty, valid, and the current value was created
          // by the current widget then disable the widget because that means
          // that we have validated the field value and it was valid, so we
          // don't need the widget anymore.
          setWidget(null);
        }
      } else {
        // When the widget open is not the same as the one that created the
        // current value, then unset the value because we must have switched the
        // widget since we selected the current value.
        onChange(undefined);
      }
    }

    // When there is pasted media and a widget is selected, then unset the
    // pasted media because pasted media does not use a widget, only a
    // confirmation.
    if (pastedMedia) {
      setWidget(null);
    }
  }, [
    dirty,
    valid,
    value,
    onChange,
    pastedMedia,
    setPastedMedia,
    setWidget,
    widget,
  ]);

  return (
    <>
      {/* Show the input widget that's selected. */}
      {pastedMedia ? (
        <MediaConfirmPrompt
          media={pastedMedia}
          onConfirm={onConfirmPastedMedia}
          onRemove={onRemove}
        />
      ) : widget === "gifs" ? (
        gifConfig.key &&
        gifConfig.maxRating && (
          <>
            {gifConfig.provider === GQLGIF_MEDIA_SOURCE.GIPHY && (
              <GiphyInput
                onSelect={onGiphySelect}
                apiKey={gifConfig.key}
                maxRating={gifConfig.maxRating}
              />
            )}
            {gifConfig.provider === GQLGIF_MEDIA_SOURCE.TENOR && (
              <TenorInput onSelect={onTenorSelect} />
            )}
          </>
        )
      ) : widget === "external" ? (
        <ExternalImageInput onSelect={onExternalImageSelect} />
      ) : null}

      {/* If there's no widget, and we have a valid url, display preview */}
      {!widget && value?.url && valid ? (
        isMediaLink(value) ? (
          <MediaPreview media={value} siteID={siteID} onRemove={onRemove} />
        ) : (
          <GifPreview url={value.url} onRemove={onRemove} />
        )
      ) : null}

      {/* Show any errors associated with this field. */}
      {error && (
        <CallOut
          color="error"
          title={error}
          titleWeight="semiBold"
          icon={<SvgIcon Icon={AlertCircleIcon} />}
          role="alert"
        />
      )}
    </>
  );
};

export default MediaField;

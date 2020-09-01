import { FunctionComponent, useCallback, useEffect, useState } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";

interface KeyStop {
  id?: string;
  isLoadMore: boolean;
  element: Element;
}

const KeyboardShortcuts: FunctionComponent = () => {
  const { pym } = useCoralContext();

  const [currentStop, setCurrentStop] = useState<KeyStop | null>(null);

  const scrollToElement = useCallback(
    (stop: KeyStop) => {
      if (!pym || !stop || !stop.id) {
        return;
      }

      const id = `comment-${stop.id}`;

      pym.scrollParentToChildEl(id);
    },
    [pym]
  );

  const getKeyStops = useCallback(() => {
    const matches = document.querySelectorAll(`[data-keystop="true"]`);
    return matches;
  }, []);

  const toKeyStop = useCallback((el: Element) => {
    const id = el.attributes.getNamedItem("data-keyid");
    const isLoadMore = el.attributes.getNamedItem("data-isloadmore");

    return {
      element: el,
      id: id ? id.value : undefined,
      isLoadMore: isLoadMore ? isLoadMore.value === "true" : false,
    };
  }, []);

  const findNextElement = useCallback((): KeyStop | null => {
    const stops = getKeyStops();

    if (currentStop === null && stops.length > 0) {
      const stop = stops[0];
      return toKeyStop(stop);
    } else if (currentStop !== null && currentStop.id && stops.length > 0) {
      let index = -1;
      stops.forEach((el, key) => {
        if (
          el.attributes.getNamedItem("data-keyid")?.value === currentStop.id
        ) {
          index = key;
        }
      });

      if (index >= 0 && index + 1 < stops.length) {
        const stop = stops[index + 1];
        return toKeyStop(stop);
      }
    }

    return null;
  }, [getKeyStops, currentStop, toKeyStop]);

  const findPreviousElement = useCallback((): KeyStop | null => {
    if (!currentStop) {
      return null;
    }

    const stops = getKeyStops();

    let index = -1;
    stops.forEach((el, key) => {
      if (el.attributes.getNamedItem("data-keyid")?.value === currentStop.id) {
        index = key;
      }
    });

    if (index - 1 >= 0 && index < stops.length) {
      const stop = stops[index - 1];
      return toKeyStop(stop);
    }

    return null;
  }, [currentStop, getKeyStops, toKeyStop]);

  const jumpToNextElement = useCallback(() => {
    const stop = findNextElement();
    if (!stop) {
      return;
    }

    if (stop.isLoadMore) {
      const clickEvent = document.createEvent("MouseEvent");
      clickEvent.initMouseEvent(
        "click",
        true,
        true,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      stop.element.dispatchEvent(clickEvent);
    } else {
      scrollToElement(stop);
      setCurrentStop(stop);
    }
  }, [findNextElement, scrollToElement]);

  const jumpToPreviousElement = useCallback(() => {
    const stop = findPreviousElement();
    if (!stop) {
      return;
    }

    scrollToElement(stop);
    setCurrentStop(stop);
  }, [findPreviousElement, scrollToElement]);

  const handleKeyMessage = useCallback(
    (e: any) => {
      try {
        if (!e.data) {
          return;
        }

        const dataString: string = e.data;
        const dataIndex = dataString.indexOf("{");
        const p = dataString.substring(dataIndex, dataString.length);

        const payload = JSON.parse(p);

        if (
          payload.event === "keypress" &&
          payload.data.shiftKey &&
          payload.data.key === "C"
        ) {
          jumpToPreviousElement();
        } else if (payload.event === "keypress" && payload.data.key === "c") {
          jumpToNextElement();
        }
      } catch {
        // ignore
      }
    },
    [jumpToNextElement, jumpToPreviousElement]
  );

  const handleKeyPress = useCallback(
    (e: any) => {
      try {
        if (e.shiftKey && e.key === "C") {
          jumpToPreviousElement();
        } else if (e.key === "c") {
          jumpToNextElement();
        }
      } catch {
        // ignore
      }
    },
    [jumpToNextElement, jumpToPreviousElement]
  );

  useEffect(() => {
    window.addEventListener("message", handleKeyMessage);
    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("message", handleKeyMessage);
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [handleKeyMessage, handleKeyPress]);

  return null;
};

export default KeyboardShortcuts;

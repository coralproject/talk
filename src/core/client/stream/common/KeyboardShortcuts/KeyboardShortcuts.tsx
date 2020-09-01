import { FunctionComponent, useCallback, useEffect } from "react";

import KeyedComments from "./KeyedComments";

function scrollToComment(index: number) {
  const commentID = KeyedComments.comments[index];
  if (!commentID) {
    return;
  }

  const container = document.querySelector(`[data-keyid="${commentID}"]`);
  if (!container) {
    return;
  }

  container.scrollIntoView();
  KeyedComments.setCurrentIndex(index);
}

const KeyboardShortcuts: FunctionComponent = () => {
  const handleKeyMessage = useCallback((e: any) => {
    try {
      if (!e.data) {
        return;
      }

      const dataString: string = e.data;
      const dataIndex = dataString.indexOf("{");
      const p = dataString.substring(dataIndex, dataString.length);

      const payload = JSON.parse(p);

      if (payload.event === "keypress" && payload.data.key === "c") {
        scrollToComment(KeyedComments.currentIndex() + 1);
      }
      if (payload.event === "keypress" && payload.data.key === "x") {
        scrollToComment(KeyedComments.currentIndex() - 1);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleKeyPress = useCallback((e: any) => {
    try {
      if (e.key === "c") {
        scrollToComment(KeyedComments.currentIndex() + 1);
      }
      if (e.key === "x") {
        scrollToComment(KeyedComments.currentIndex() - 1);
      }
    } catch {
      // ignore
    }
  }, []);

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

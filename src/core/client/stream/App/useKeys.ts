import { useEffect, useState } from "react";

function useKeys() {
  const [key, setKey] = useState(null);

  function handleKeyMessage(e: any) {
    try {
      if (!e.data) {
        return;
      }

      const dataString: string = e.data;
      const dataIndex = dataString.indexOf("{");
      const p = dataString.substring(dataIndex, dataString.length);

      const payload = JSON.parse(p);
      if (payload.event === "keypress") {
        setKey(payload.data.code);
      } else {
        setKey(null);
      }
    } catch {
      setKey(null);
    }
  }

  function handleKeyPress(e: any) {
    try {
      setKey(e.code);
    } catch {
      setKey(null);
    }
  }

  useEffect(() => {
    window.addEventListener("message", handleKeyMessage);
    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("message", handleKeyMessage);
      window.removeEventListener("keypress", handleKeyPress);
    };
  });

  return key;
}

export default useKeys;

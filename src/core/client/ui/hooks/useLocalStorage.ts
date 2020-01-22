import { useState } from "react";

type SetValue = (value: string) => void;

function useLocalStorage(key: string, initialValue?: string) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      // console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: SetValue) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // console.log(error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;

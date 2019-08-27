import diff from "object-diff";
import React, { useCallback, useEffect, useState } from "react";
import { FormSpy } from "react-final-form";

import { Omit } from "coral-framework/types";

interface Props<T> {
  save: (values: T) => Promise<void>;
  values: T;
  debounce: number;
}

function AutoSave<T extends {}>(props: Props<T>) {
  const [timeoutRef, setTimeoutRef] = useState<NodeJS.Timer | null>(null);
  const [values, setValues] = useState(props.values);
  const [promise, setPromise] = useState<Promise<void> | null>(null);

  const save = useCallback(async () => {
    if (promise) {
      await promise;
    }

    // Check to see if the values have changed.
    const difference = diff(values, props.values);
    if (Object.keys(difference).length) {
      // Values have changed.
      setValues(props.values);
      const saving = props.save(props.values);
      setPromise(saving);
      await saving;
      setPromise(null);
    }
  }, [props.save, props.values]);

  useEffect(() => {
    if (timeoutRef) {
      clearTimeout(timeoutRef);
    }
    setTimeoutRef(setTimeout(save, props.debounce));
  }, [props.debounce, props.values]);

  // This component doesn't have to render anything, but it can render
  // submitting state.
  return null;
}

export default function<T extends {}>(props: Omit<Props<T>, "values">) {
  return (
    <FormSpy subscription={{ values: true }}>
      {({ values }) => <AutoSave values={values} {...props} />}
    </FormSpy>
  );
}

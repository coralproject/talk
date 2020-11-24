import { FormApi, FormState, FormSubscription } from "final-form";
import { useEffect } from "react";
import { useForm } from "react-final-form";

interface Props<T> {
  subscription: FormSubscription;
  onChange: (state: FormState<T, Partial<T>>, form: FormApi<T>) => void;
}

const FormSync = <T extends {}>({ onChange, subscription }: Props<T>) => {
  const form = useForm<T>();

  useEffect(
    () => form.subscribe((state) => onChange(state, form), subscription),
    [form, onChange, subscription]
  );

  return null;
};

export default FormSync;

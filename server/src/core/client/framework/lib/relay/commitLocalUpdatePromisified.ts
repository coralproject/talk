import {
  commitLocalUpdate,
  Environment,
  RecordSourceProxy,
} from "relay-runtime";

export default function commitLocalUpdatePromisified(
  environment: Environment,
  updater: (store: RecordSourceProxy) => Promise<void>
) {
  return new Promise<void>((resolve, reject) => {
    commitLocalUpdate(environment, (store) => {
      updater(store)
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  });
}

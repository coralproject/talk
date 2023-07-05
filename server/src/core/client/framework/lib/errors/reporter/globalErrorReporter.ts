import { ComponentType } from "react";
import { v1 as uuid } from "uuid";

import { ErrorReport, ErrorReporter, User } from "./reporter";

class FakeErrorReporter implements ErrorReporter {
  public report(err: any): ErrorReport {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    return {
      name: "global",
      id: uuid(),
    };
  }

  public setUser(user: User | null): void {}

  public get ErrorBoundary(): ComponentType | undefined {
    return undefined;
  }
}

export let globalErrorReporter: ErrorReporter = new FakeErrorReporter();

export function setGlobalErrorReporter(reporter: ErrorReporter) {
  globalErrorReporter = reporter;
}

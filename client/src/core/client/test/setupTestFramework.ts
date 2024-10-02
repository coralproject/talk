import "@testing-library/jest-dom";
import { toHaveNoViolations } from "jest-axe";
import { TextEncoder } from "util";

import expectAndFail from "./expectAndFail";

// Automatically unmock console.
import "jest-mock-console/dist/setupTestFramework";
import "./setupConsole";

(global as any).CSS = { supports: jest.fn() };

// Expose a version of expect that will fail tests immediately
// when assertion fails. This works even inside of an try-catch block
// to get around: https://github.com/facebook/jest/issues/3917
(global as any).expectAndFail = expectAndFail;

// we need to have this for count script
(global as any).TextEncoder = TextEncoder;

// Log unhandled rejections.
// eslint-disable-next-line no-console
process.on("unhandledRejection", (err) => {
  // eslint-disable-next-line no-console
  console.error("Unhandled Rejection");
  // eslint-disable-next-line no-console
  console.error(err);
});

expect.extend(toHaveNoViolations);

// axe checking takes a bit of time.
beforeEach(() => {
  jest.setTimeout(20000);
});

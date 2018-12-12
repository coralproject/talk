// Automatically unmock console.
import "jest-mock-console/dist/setupTestFramework";

// Log unhandled rejections.
// tslint:disable-next-line:no-console
process.on("unhandledRejection", err => {
  // tslint:disable-next-line:no-console
  console.error("Unhandled Rejection");
  // tslint:disable-next-line:no-console
  console.error(err);
});

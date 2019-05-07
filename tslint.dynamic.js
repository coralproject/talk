/**
 * This file contains the dynamic part of `tslint`.
 */

module.exports = {
  // Decrease default linting severity during development.
  defaultSeverity: process.env.NODE_ENV === "development" ? "warning" : "error",
};

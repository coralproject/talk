/**
 * From the `querystringify` project:
 * The parse method transforms a given query string in to an object.
 * Parameters without values are set to empty strings.
 * It does not care if your query string is prefixed with a ? or not.
 * It just extracts the parts between the = and &:
 */
export { parse as default } from "querystringify";

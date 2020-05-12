/**
 * Initiate a jsonp request.
 *
 * @param endpoint  jsonp endpoint
 * @param callback  name of global callback to receive response
 * @param args      args to send along the jsonp request.
 */
function jsonp(
  endpoint: string,
  callback: string,
  args: Record<string, string | number | undefined>
) {
  // Create the script element.
  const script = document.createElement("script");
  script.src = `${endpoint}?callback=${callback}`;

  // For each of the arguments, add to the source string.
  Object.keys(args)
    // Because ordering of the keys isn't well defined, we sort the keys to
    // ensure consistent ordering.
    .sort()
    .forEach((key) => {
      const val = args[key];
      if (val === undefined) {
        return;
      }

      // Append the new parameter to the source.
      script.src += `&${key}=${encodeURIComponent(val)}`;
    });

  // Attach the script to the body.
  document.body.appendChild(script);
}

export default jsonp;

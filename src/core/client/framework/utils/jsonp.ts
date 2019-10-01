/**
 * Initiate a jsonp request.
 * @argument endpoint  jsonp endpoint
 * @argument callback  name of global callback to receive response
 * @argument args      args to send along the jsonp request.
 */
function jsonp(
  endpoint: string,
  callback: string,
  args: Record<string, string | number | null | undefined>
) {
  const script = document.createElement("script");
  script.src = `${endpoint}?callback=${callback}`;
  Object.keys(args).forEach(key => {
    let val = "";
    if (args[key] === undefined) {
      return;
    }
    if (typeof args[key] === "string") {
      val = args[key] as string;
    } else {
      val = JSON.stringify(args[key]);
    }
    script.src += `&${key}=${encodeURIComponent(val)}`;
  });
  document.body.appendChild(script);
}

export default jsonp;

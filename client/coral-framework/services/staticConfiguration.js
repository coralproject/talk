/**
 * getStaticConfiguration will return a singleton of the static configuration
 * object provided via a JSON DOM element.
 */
let staticConfiguration = null;
export const getStaticConfiguration = () => {
  if (staticConfiguration != null) {
    return staticConfiguration;
  }

  const configElement = document.querySelector('#data');

  staticConfiguration = JSON.parse(
    configElement ? configElement.textContent : '{}'
  );

  return staticConfiguration;
};

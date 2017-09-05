const configElement = document.querySelector('#data');

export const CONFIG = JSON.parse(configElement ? configElement.textContent : '{}');

// Extract the payload from the response,

export default function extractPayload(response: any): any {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const keys = Object.keys(response);
  if (keys.length !== 1) {
    return response;
  }
  return response[keys[0]];
}

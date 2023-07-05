import { urls } from "coral-framework/helpers";

export default function getEndpointLink(endpointID: string) {
  return `${urls.admin.configureWebhookEndpoint}/${endpointID}`;
}

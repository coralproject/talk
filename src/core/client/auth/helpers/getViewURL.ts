import { View } from "coral-auth/mutations/SetViewMutation";
import { modifyQuery } from "coral-framework/utils";

export default function getViewURL(view: View) {
  return modifyQuery(window.location.href, { view });
}

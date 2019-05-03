import { View } from "talk-auth/mutations/SetViewMutation";
import { modifyQuery } from "talk-framework/utils";

export default function getViewURL(view: View) {
  return modifyQuery(window.location.href, { view });
}

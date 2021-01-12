import { CountJSONPData } from "coral-common/types/count";
import { COUNT_SELECTOR } from "coral-framework/constants";
import getPreviousCountStorageKey from "coral-framework/helpers/getPreviousCountStorageKey";

type GetCountFunction = (opts?: { reset?: boolean }) => void;

/**
 * getPreviousCount will return the previous count if we can find it in storage.
 *
 * @param storyID the ID of the Story that we're referencing
 */
function getPreviousCount(storyID: string): number | null {
  // Calculate the key for this value used in storage. We have to prefix this
  // with `coral:` because inside the framework we automatically prefix it.
  const key = "coral:" + getPreviousCountStorageKey(storyID);

  let previousCount: number;
  try {
    // Try to get the storage entry for this. If it isn't available then
    // either
    const item = localStorage.getItem(key);
    if (!item) {
      return null;
    }

    // Parse the previous count.
    previousCount = parseInt(item, 10);
  } catch (err) {
    // Looks like we encountered an error parsing the previous count data,
    // we should remove the storage entry.
    localStorage.removeItem(key);
    return null;
  }

  return previousCount;
}

interface CountElementDataset {
  coralCount: string;
  coralPreviousCount?: string;
  coralNewCount?: string;
}

function createCountElementEnhancer({
  html,
  count: currentCount,
  id: storyID,
}: CountJSONPData) {
  // Get the dataset together for setting properties on the enhancer.
  const dataset: CountElementDataset = {
    coralCount: currentCount.toString(),
  };

  // Create the root element we're using for this.
  const element = document.createElement("span");

  // Update the innerHTML which contains the count and new value..
  element.innerHTML = html;

  if (storyID) {
    const previousCount = getPreviousCount(storyID);
    if (previousCount !== null && previousCount < currentCount) {
      // The new count is just the current count subtracting from the previous
      // count.
      const newCount = currentCount - previousCount;

      // Add the counts to the dataset so it can be targeted by CSS if you want.
      dataset.coralPreviousCount = previousCount.toString();
      dataset.coralNewCount = newCount.toString();

      // Insert the divider " / "
      const dividerElement = document.createElement("span");
      dividerElement.className = "coral-new-count-divider";
      dividerElement.innerText = " / ";
      element.appendChild(dividerElement);

      // Add the number of new comments to that.
      const newCountNumber = document.createElement("span");
      newCountNumber.className = "coral-new-count-number";
      newCountNumber.innerText = newCount.toString();
      element.appendChild(newCountNumber);

      // Add the number of new comments to that.
      const newCountText = document.createElement("span");
      newCountText.className = "coral-new-count-text";
      newCountText.innerText = " New";
      element.appendChild(newCountText);
    }
  }

  return (target: HTMLElement) => {
    // Add the innerHTML from the element to the target element. This will
    // include any optional children that were appended related to new comment
    // counts.
    target.innerHTML = element.innerHTML;

    // For each of the dataset elements, add it to the target.
    target.dataset.coralCount = dataset.coralCount;

    // If these are available, then set them as well.
    if (dataset.coralNewCount && dataset.coralPreviousCount) {
      target.dataset.coralNewCount = dataset.coralNewCount;
      target.dataset.coralPreviousCount = dataset.coralPreviousCount;
    }
  };
}

/**
 * injectJSONPCallback will register the `CoralCount` on the window.
 *
 * @param getCount a function that when executed will allow you to reset the count
 */
function injectJSONPCallback(getCount: GetCountFunction) {
  (window as any).CoralCount = {
    setCount: (data: CountJSONPData) => {
      // Find all the elements with ref. These are the ones that should be
      // updated with this enhanced value.
      const elements = document.querySelectorAll(
        `${COUNT_SELECTOR}[data-coral-ref='${data.ref}']`
      );

      // Create the element enhancer. This helps when we
      const enhance = createCountElementEnhancer(data);

      // For each of the found elements, enhance the element with the count
      // data.
      Array.prototype.forEach.call(elements, (element: HTMLElement) => {
        enhance(element);
      });
    },
    getCount,
  };
}

export default injectJSONPCallback;
import { CountJSONPData } from "coral-common/types/count";
import { COUNT_SELECTOR } from "coral-framework/constants";
// import getPreviousCountStorageKey from "coral-framework/helpers/getPreviousCountStorageKey";

type GetCountFunction = (opts?: { reset?: boolean }) => void;

interface CountElementDataset {
  coralCount: string;
  coralPreviousCount?: string;
  coralNewCount?: string;
}

function createCountElementEnhancer({
  html,
  count: currentCount,
}: CountJSONPData) {
  // Get the dataset together for setting properties on the enhancer.
  const dataset: CountElementDataset = {
    coralCount: currentCount.toString(),
  };

  // Create the root element we're using for this.
  const element = document.createElement("span");

  // Update the innerHTML which contains the count and new value..
  element.innerHTML = html;

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

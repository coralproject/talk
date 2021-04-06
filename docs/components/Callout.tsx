import { FunctionComponent } from "react";

import useLocalStorage from "react-use/lib/useLocalStorage";

/**
 * CALLOUT_ID is used to allow users to dismiss the callout. If the callout
 * value changes substantially, the following ID should be changed.
 */
const CALLOUT_ID = "c12522fd-24e5-4517-8c9a-403e3aa4be2e";

/**
 * Callout is the custom callout to be displayed at the top of documentation
 * pages.
 *
 * Note that because this is done synchronous, you'll see an error about:
 *
 *  Did not expect server HTML to contain a <div> in <div>.
 *
 * This is expected as the server code does not know about localStorage.
 */
const Callout: FunctionComponent = () => {
  const [dismissedID, setDismissedID] = useLocalStorage("callout-dismissed-id");

  if (dismissedID === CALLOUT_ID) {
    return null;
  }

  return (
    <div className="bg-coral">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex p-2 rounded-lg bg-coral-dark">
              {/* Heroicon name: speakerphone */}
              <svg
                className="h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                />
              </svg>
            </span>
            <p className="ml-3 font-medium text-white truncate">
              <span className="md:hidden">Hosting and support packages</span>
              <span className="hidden md:inline">
                We offer hosting and support packages for Coral, as well as
                exclusive, customer-only features
              </span>
            </p>
          </div>
          <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
            <a
              href="https://coralproject.net/pricing/"
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-coral bg-white hover:bg-gray-50"
            >
              Learn more
            </a>
          </div>
          <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
            <button
              type="button"
              className="-mr-1 flex p-2 rounded-md hover:bg-coral focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
              onClick={() => {
                setDismissedID(CALLOUT_ID);
              }}
            >
              <span className="sr-only">Dismiss</span>
              {/* Heroicon name: x */}
              <svg
                className="h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Callout;

import { FunctionComponent } from "react";

const Search: FunctionComponent = () => {
  return (
    <>
      <button className="flex space-x-3 w-full hover:text-coral transition-colors py-3">
        <svg width="24" height="24" fill="none">
          <path
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
        <span>Search documentation...</span>
      </button>
    </>
  );
};

export default Search;

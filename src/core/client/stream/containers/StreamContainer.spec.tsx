import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";

import { StreamContainer } from "./StreamContainer";

it("renders correctly", () => {
  const props: any = {
    asset: {
      id: "asset-id",
      isClosed: false,
      comments: {
        edges: [{ node: { id: "comment-1" } }, { node: { id: "comment-2" } }],
      },
    },
    relay: {
      hasMore: noop,
      isLoading: noop,
    },
  };
  const wrapper = shallow(<StreamContainer {...props} />);
  expect(wrapper).toMatchSnapshot();
});

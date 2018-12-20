import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "talk-framework/types";

import ShowConversationLink from "./ShowConversationLink";

it("renders correctly", () => {
  const props: PropTypesOf<typeof ShowConversationLink> = {
    id: "id",
    onClick: noop,
    href: "http://localhost/comment",
  };
  const renderer = createRenderer();
  renderer.render(<ShowConversationLink {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

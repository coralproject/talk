import React from "react";
import { createRenderer } from "react-test-renderer/shallow";
import Comment from "./Comment";

it("renders username and body", () => {
  const props = {
    id: "id",
    author: {
      username: "Marvin",
    },
    body: "Woof",
  };
  const renderer = createRenderer();
  renderer.render(<Comment {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders with gutterBottom", () => {
  const props = {
    id: "id",
    author: {
      username: "Marvin",
    },
    body: "Woof",
    gutterBottom: true,
  };
  const renderer = createRenderer();
  renderer.render(<Comment {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import Configure from "./Configure";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Configure> = {
    onSave: noop,
    onChange: noop,
  };
  const wrapper = shallow(<Configure {...props} />);
  expect(wrapper).toMatchSnapshot();
});

import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import DurationField, { DURATION_UNIT } from "./DurationField";

it("renders correctly with default units", () => {
  const props: PropTypesOf<typeof DurationField> = {
    name: "duration",
    value: "",
    disabled: false,
    onChange: noop,
  };
  const renderer = createRenderer();
  renderer.render(<DurationField {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders correctly with specified units", () => {
  const props: PropTypesOf<typeof DurationField> = {
    name: "duration",
    value: "",
    disabled: false,
    onChange: noop,
    units: [DURATION_UNIT.SECOND, DURATION_UNIT.HOUR],
  };
  const renderer = createRenderer();
  renderer.render(<DurationField {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("use best matching unit", () => {
  const props: PropTypesOf<typeof DurationField> = {
    name: "duration",
    value: "3600",
    disabled: false,
    onChange: noop,
    units: [DURATION_UNIT.SECOND, DURATION_UNIT.MINUTE, DURATION_UNIT.HOUR],
  };
  const renderer = createRenderer();
  renderer.render(<DurationField {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("use initial unit if 0", () => {
  const props: PropTypesOf<typeof DurationField> = {
    name: "duration",
    value: "0",
    disabled: false,
    onChange: noop,
    units: [DURATION_UNIT.SECOND, DURATION_UNIT.MINUTE, DURATION_UNIT.HOUR],
  };
  const renderer = createRenderer();
  renderer.render(<DurationField {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("accepts invalid input", () => {
  const props: PropTypesOf<typeof DurationField> = {
    name: "duration",
    value: "this is so invalid",
    disabled: false,
    onChange: noop,
    units: [DURATION_UNIT.SECOND, DURATION_UNIT.MINUTE, DURATION_UNIT.HOUR],
  };
  const renderer = createRenderer();
  renderer.render(<DurationField {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

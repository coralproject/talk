import Joi from "joi";

import { validate } from "coral-server/app/request/body";

it("strips out unknown fields", () => {
  const payload = { a: 1, b: 2, c: 3 };
  const schema = Joi.object().keys({});

  expect(validate(schema, payload)).toEqual({});
});

it("allows valid fields", () => {
  const payload = { a: 1, b: 2, c: 3 };
  const schema = Joi.object().keys({ a: Joi.number() });

  expect(validate(schema, payload)).toEqual({ a: 1 });
});

it("allows valid fields from extended schema", () => {
  const payload = { a: 1, b: 2, c: 3 };
  const schema = Joi.object().keys({ a: Joi.number() });
  const extendedSchema = schema.keys({ b: Joi.number() });

  expect(validate(extendedSchema, payload)).toEqual({ a: 1, b: 2 });
});

it("throws an error for missing fields", () => {
  const payload = { a: 1, b: 2, c: 3 };
  const schema = Joi.object().keys({ d: Joi.number() });

  expect(() => validate(schema, payload)).toThrowErrorMatchingSnapshot();
});

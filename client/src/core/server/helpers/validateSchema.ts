import Joi from "joi";

function validateSchema<T extends {}>(schema: Joi.Schema, body: any): T {
  // Extract the schema from the body.
  const { value, error: err } = schema.validate(body, {
    stripUnknown: true,
    presence: "required",
    abortEarly: false,
  });

  if (err) {
    // TODO: wrap error?
    throw err;
  }

  return value;
}

export default validateSchema;

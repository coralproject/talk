import Joi from "@hapi/joi";

/**
 * validate will strip unknown fields and perform validation against it. It will
 * throw any error encountered.
 *
 * @param schema the Joi schema to validate against
 * @param body the body to parse and strip of unknown fields
 */
export const validate = (schema: Joi.Schema, body: any) => {
  // Extract the schema from the request.
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
};

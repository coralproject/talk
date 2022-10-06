import { get } from "lodash";
import { Collection, FindOneAndUpdateOption, UpdateQuery } from "mongodb";

import logger from "coral-server/logger";
import { FilterQuery } from "coral-server/models/helpers";

import { filterFreshSigningSecrets, generateSigningSecret } from "./helpers";

export interface SigningSecret {
  /**
   * kid is the identifier for the key used when verifying tokens issued by the
   * provider.
   */
  kid: string;

  /**
   * secret is the actual underlying secret used to verify the tokens with.
   */
  secret: string;

  /**
   * createdAt is the date that the key was created at.
   */
  createdAt: Date;

  /**
   * rotatedAt is the time that the token was rotated out.
   */
  rotatedAt?: Date;

  /**
   * inactiveAt is the date that the token can no longer be used to validate
   * tokens.
   */
  inactiveAt?: Date;
}

/**
 * SigningSecretResource is a resource that contains signing credentials.
 */
export interface SigningSecretResource {
  /**
   * signingSecrets are secrets used for signing and verification.
   */
  signingSecrets: SigningSecret[];
}

interface SigningSecretResourceNode extends SigningSecretResource {
  id: string;
}

interface RotateSigningSecretOptions<T extends {}> {
  /**
   * collection is the database collection that the document exists in.
   */
  collection: Collection<Readonly<T>>;

  /**
   * filter is the database query used to filter out the specific document that
   * contains a SigningResource.
   */
  filter: FilterQuery<T>;

  /**
   * path is the dot notation path of the resource that contains the signing
   * secrets.
   */
  path: string;

  /**
   * prefix is the secret prefix that will be added to the new secret that is
   * generated.
   */
  prefix: string;

  /**
   * id is the identifier used when querying for the resource identified by the
   * `path` parameter above.
   */
  id?: string;

  /**
   * inactiveAt is the date that the previous keys should be active for.
   */
  inactiveAt: Date;

  /**
   * now is the current date.
   */
  now: Date;
}

/**
 * getSecretKIDsToDeprecate will return all the keys that should be deprecated
 * from the first phase of the rolling process.
 *
 * @param signingSecrets the keys returned by the query operation
 */
const getSecretKIDsToDeprecate = (signingSecrets: SigningSecret[]) =>
  signingSecrets
    // By excluding the last one (the one we just pushed)...
    .splice(0, signingSecrets.length - 1)
    // And only finding keys that have not been rotated yet.
    .filter(filterFreshSigningSecrets())
    // And get their kid's.
    .map((s) => s.kid);

async function pushNewSigningSecret<T extends {}>({
  collection,
  filter,
  path,
  prefix,
  id,
  now,
}: RotateSigningSecretOptions<T>) {
  // Create the new secret.
  const secret = generateSigningSecret(prefix, now);

  // Generate the update for the operation.
  let update: UpdateQuery<T>;
  if (id) {
    update = {
      $push: {
        [`${path}.$[resource].signingSecrets`]: secret,
      },
    };
  } else {
    update = {
      $push: {
        [`${path}.signingSecrets`]: secret,
      },
    };
  }

  // Generate the options for the operation.
  const options: FindOneAndUpdateOption = {
    // False to return the updated document instead of the original
    // document.
    returnOriginal: false,
  };
  if (id) {
    options.arrayFilters = [
      // Select the secret resource under the object.
      { "resource.id": id },
    ];
  }

  // Update the resource with this new secret.
  const result = await collection.findOneAndUpdate(filter, update, options);
  if (!result.value) {
    return null;
  }

  return result.value;
}

function getResourceFromDoc<T extends {}>(
  { id, path }: Pick<RotateSigningSecretOptions<T>, "id" | "path">,
  doc: T
) {
  if (id) {
    // The ID was provided, so we need to get the referenced resource by it's
    // ID. This also means that the resource indicated exists in an Array, so
    // treat it as such.

    // Get the resource referenced by the path (should be a path to an array).
    const resources: SigningSecretResourceNode[] | undefined = get(doc, path);
    if (!resources || !Array.isArray(resources)) {
      return null;
    }

    // Get the specific resource from the array.
    const resource = resources.find((r) => r.id === id);
    if (!resource) {
      return null;
    }

    return resource;
  }

  // The ID was not provided, which means that the resource is not in an array.
  const resource: SigningSecretResource | undefined = get(doc, path);
  if (!resource) {
    if (Array.isArray(resource)) {
      throw new Error("we were not passed an ID but got an array anyways");
    }

    return null;
  }

  return resource;
}

async function deprecateOldSigningSecrets<T extends {}>(
  {
    collection,
    path,
    inactiveAt,
    filter,
    id,
    now,
  }: Pick<
    RotateSigningSecretOptions<T>,
    "collection" | "path" | "inactiveAt" | "filter" | "id" | "now"
  >,
  doc: Readonly<T>
) {
  // Get the resource from the value.
  const resource = getResourceFromDoc({ id, path }, doc);
  if (!resource) {
    return null;
  }

  // Get the secrets we need to deactivate...
  const secretKIDsToDeprecate = getSecretKIDsToDeprecate(
    resource.signingSecrets
  );
  if (secretKIDsToDeprecate.length === 0) {
    return doc;
  }

  logger.trace(
    { kids: secretKIDsToDeprecate, filter, arrayFilter: { id: id || null } },
    "deprecating old signingSecrets"
  );

  // Construct the update operation for rotating the secret.
  let update: UpdateQuery<T>;
  if (id) {
    update = {
      $set: {
        [`${path}.$[resource].signingSecrets.$[signingSecret].inactiveAt`]:
          inactiveAt,
        [`${path}.$[resource].signingSecrets.$[signingSecret].rotatedAt`]: now,
      },
    };
  } else {
    update = {
      $set: {
        [`${path}.signingSecrets.$[signingSecret].inactiveAt`]: inactiveAt,
        [`${path}.signingSecrets.$[signingSecret].rotatedAt`]: now,
      },
    };
  }

  // Construct the options for the operation.
  const options: FindOneAndUpdateOption = {
    // False to return the updated document instead of the original
    // document.
    returnOriginal: false,
    arrayFilters: [
      // Select any signing secrets with the given ids.
      { "signingSecret.kid": { $in: secretKIDsToDeprecate } },
    ],
  };
  if (id) {
    options.arrayFilters!.push(
      // Select the secret resource under the object.
      { "resource.id": id }
    );
  }

  // Deactivate the old keys.
  const result = await collection.findOneAndUpdate(filter, update, options);
  if (!result.value) {
    return null;
  }

  return result.value;
}

export async function rotateSigningSecret<T extends {}>(
  options: RotateSigningSecretOptions<T>
) {
  // Push the new secret into the resource and return it.
  let doc = await pushNewSigningSecret(options);
  if (!doc) {
    return null;
  }

  // Deprecate any old secrets on the document.
  doc = await deprecateOldSigningSecrets(options, doc);
  if (!doc) {
    return null;
  }

  return doc;
}

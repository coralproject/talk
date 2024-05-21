export class MissingAuthError extends Error {
  public readonly name: string;

  constructor(message: string | undefined) {
    super(message);

    this.name = "Missing Auth Error";
  }
}

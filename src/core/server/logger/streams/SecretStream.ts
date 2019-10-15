import { Transform, TransformCallback } from "stream";

export class SecretStream extends Transform {
  private static keys = "(key|token|clientID|clientSecret|password)";
  private static pattern = new RegExp(
    `"(${SecretStream.keys})":"([^"]*)"`,
    "ig"
  );

  private static replace(chunk: string): string {
    return chunk.replace(SecretStream.pattern, `"$1":"[Sensitive]"`);
  }

  public _transform(
    chunk: string | object | Buffer,
    encoding: string,
    callback: TransformCallback
  ) {
    try {
      if (typeof chunk === "string") {
        this.push(SecretStream.replace(chunk));
      } else if (Buffer.isBuffer(chunk)) {
        this.push(SecretStream.replace(chunk.toString()));
      } else {
        this.push(SecretStream.replace(JSON.stringify(chunk)));
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }

    callback();
  }
}

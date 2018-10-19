declare module "content-security-policy-builder" {
  export default function builder({
    directives,
  }: {
    directives: Record<string, any>;
  }): string;
}

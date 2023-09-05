declare module "jwt-decode" {
  export default function jwt_decode<T = {}>(accessToken: string): T;
}

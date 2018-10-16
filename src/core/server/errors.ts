/* tslint:disable:max-classes-per-file */

export class TalkErr implements Error {
  public name = "talk_err";
  public message = "an error has occurred";
}

export class HTTPErr extends TalkErr {
  public name = "http_error";
  public message = "a http error occurred";
  public code = 500;
}

export class TokenErr extends HTTPErr {
  public name = "token_err";
  public message = "a token error occurred";
  public code = 400;
}

export class TokenExpiredErr extends TokenErr {
  public name = "token_expired_err";
  public message = "the provided token has expired";
  public code = 401;
}

export class TokenNotFoundErr extends TokenErr {
  public name = "token_not_found_err";
  public message = "the expected token was not found on the request";
  public code = 400;
}

export class TenantNotFoundErr extends HTTPErr {
  public name = "tenant_not_found";
  public message = "no tenant could be found";
  public code = 404;
}

export class AuthIntegrationDisabledErr extends HTTPErr {
  public name = "auth_integration_disabled";
  public message = "the specified auth integration is disabled";
  public code = 400;
}

export class UserNotFoundErr extends HTTPErr {
  public name = "user_not_found";
  public message = "no user could be found on the request";
  public code = 400;
}

export class HTTPNotFoundErr extends HTTPErr {
  public name = "not_found";
  public message = "the resource could not be found";
  public code = 404;
}

# Talk [![CircleCI](https://circleci.com/gh/coralproject/talk.svg?style=svg)](https://circleci.com/gh/coralproject/talk)

Talk is currently in Beta! [Read more about Talk here.](https://coralproject.net/products/talk.html)

Third party licenses are available via the `/client/3rdpartylicenses.txt`
endpoint when the server is running with built assets.

## Contributing to Talk

See our [Contribution Guide](https://github.com/coralproject/talk/blob/master/CONTRIBUTING.md)!

## Usage

### Installation

To set up a development environment or build from source, see [INSTALL.md](https://github.com/coralproject/talk/blob/master/INSTALL.md).

To launch a Talk server of your own from your browser without any need to muck about in a terminal or think about engineering concepts, stay tuned. We will launch [our installer](https://github.com/coralproject/talk-install) shortly!


### Configuration

The Talk application looks for the following configuration values either as environment variables:

- `TALK_MONGO_URL` (*required*) - the database connection string for the MongoDB database.
- `TALK_REDIS_URL` (*required*) - the database connection string for the Redis database.
- `TALK_ROOT_URL` (*required*) - root url of the installed application externally
available in the format: `<scheme>://<host>` without the path.
- `TALK_JWT_SECRET` (*required*) - a long and cryptographical secure random string which will be used to
sign and verify tokens via a `HS256` algorithm.
- `TALK_JWT_EXPIRY` (_optional_) - the expiry duration (`exp`) for the tokens issued for logged in sessions (Default `1 day`)
- `TALK_JWT_ISSUER` (_optional_) - the issuer (`iss`) claim for login JWT tokens (Default `process.env.TALK_ROOT_URL`)
- `TALK_JWT_AUDIENCE` (_optional_) - the audience (`aud`) claim for login JWT tokens (Default `talk`)
- `TALK_SMTP_EMAIL` (*required for email*) - the address to send emails from using the
  SMTP provider.
- `TALK_SMTP_USERNAME` (*required for email*) - username of the SMTP provider you are using.
- `TALK_SMTP_PASSWORD` (*required for email*) - password for the SMTP provider you are using.
- `TALK_SMTP_HOST` (*required for email*) - SMTP host url with format `smtp.domain.com`.
- `TALK_SMTP_PORT` (*required for email*) - SMTP port.
- `TALK_INSTALL_LOCK` (_optional for dynamic setup_) - Defaults to `FALSE`. When `TRUE`, disables the dynamic setup endpoint.
- `TALK_RECAPTCHA_SECRET` (*required for reCAPTCHA support*) - server secret used for enabling reCAPTCHA powered logins. If not provided it will instead default to providing only a time based lockout.
- `TALK_RECAPTCHA_PUBLIC` (*required for reCAPTCHA support*) - client secret used for enabling reCAPTCHA powered logins. If not provided it will instead default to providing only a time based lockout.
- `TALK_PLUGINS_JSON` (_optional_) - used to specify the plugin config via the environment

Refer to the wiki page on [Configuration Loading](https://github.com/coralproject/talk/wiki/Configuration-Loading) for
alternative methods of loading configuration during development.

## Supported Browsers

### Web

- Chrome: latest 2 versions
- Firefox: latest 2 versions, and most recent extended support version, if any
- Safari: latest 2 versions
- Internet Explorer: IE Edge, 11

### iOS Devices

- iPad
- iPad Pro
- iPhone 6 Plus
- iPhone 6
- iPhone 5

### iOS Browsers

- Chrome for iOS: latest version
- Firefox for iOS: latest version
- Safari for iOS: latest version

### Android Devices

- Galaxy S5
- Nexus 5X
- Nexus 6P

### Android Browsers

- Chrome for Android: latest version
- Firefox for Android: latest version

## License

    Copyright 2017 Mozilla Foundation

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

    See the License for the specific language governing permissions and limitations under the License.

# Host Site Test Suite

This is a useful test bed for creating multiple sites to host Coral embeds.

## Initialize the repo

This should have been done when you initialized the upper root Coral repo. If not, at the root of the repository, run:

```
npm install
```

## Config JSON for your sites

Create a file named `config.json` at the root of your repo. Don't worry, it's already ignored in the `.gitignore`.

Here is an example file with two sites with 2 stories for each site.

```
{
  "sites": [
    {
      "port": 8000,
      "coralURL": "http://localhost:3000",
      "stories": [
        {
          "id": "1"
        },
        {
          "id": "2",
          "mode": "RATINGS_AND_REVIEWS"
        }
      ]
    },
    {
      "port": 8001,
      "coralURL": "http://localhost:3000",
      "stories": [
        {
          "id": "3"
        },
        {
          "id": "4",
          "mode": "QA"
        }
      ]
    }
  ]
}
```

### Testing SSO with a site

You can also login with SSO users when testing with multi-site. An example of a SSO site looks as follows:

```
    {
      "port": 8002,
      "coralURL": "http://localhost:3000",
      "sso": {
        "secret": "<YOUR_SSO_SECRET_FROM_CORAL>",
        "users": [
          {
            "id": "5e9e2816-f56e-42e2-a843-23f6b01d97f3",
            "username": "sso-user",
            "email": "sso-user@test.com",
            "role": "COMMENTER"
          },
          {
            "id": "58aa68f4-9435-4166-8147-ed8a2ede7e6b",
            "username": "sso-user-admin",
            "email": "sso-user-admin@test.com",
            "role": "ADMIN"
          }
        ]
      },
      "stories": [
        {
          "id": "d6d44713-e032-406d-8b44-f4a9f53c95d6"
        }
      ]
    }
```

NOTE: Unless specified in the URL via a URL parameter `userID=<USER_ID>`, the system will use the first SSO user for all requests.

You can append to the story URL like so to specify which SSO user you would like to use.

`http://localhost:8000/story/d6d44713-e032-406d-8b44-f4a9f53c95d6?userID=58aa68f4-9435-4166-8147-ed8a2ede7e6b`

In this example, the story would load with the `sso-user-admin` user instead of the default (first) `sso-user`.

#### SSO Secret

Notice the `sso` section with a secret set to `<YOUR_SSO_SECRET_FROM_CORAL>` and the user details.

To get the `<YOUR_SSO_SECRET_FROM_CORAL>` go to your Coral instance (likely at http://localhost:3000 or http://localhost:8080) and head over to `Configure > Authentication > Login with Single Sign On`.

Enable `Login with Single Sign On` and also check `Allow Registration`.

Copy the `Active` key's `Secret` field and use it for `<YOUR_SSO_SECRET_FROM_CORAL>` in your config.json.

#### SSO User

The user has an `id`, `username`, and `email`. These are all required fields.

The user also has a `role` which can be `COMMENTER`, `MODERATOR`, or `ADMIN` as you choose. If you don't set it, Coral will defaul the user to be a `COMMENTER`.

## Testing custom CSS with a site

Multi-site test supports overriding the `containerClassName` and passing a `customCSSURL` as well as a `customFontsCSSURL` to the embed. If you place your custom CSS files in the `static` folder (try not to commit them though), you'll be able to host them directly from the multi-site-test bed using a URL like `http://localhost:8000/static/<YOUR_CSS_FILE_HERE>.css`.

Example site config in `config.json` setting all 3 parameters:

```
{
      "port": 8000,
      "coralURL": "http://localhost:3000",
      "customCSSURL": "http://localhost:8000/static/custom.css",
      "customFontsCSSURL": "http://localhost:8000/static/font.css",
      "containerClassName": "coral-container",
      ...
}
```

## Testing `STATIC_URI` with a site

If you specify the `STATIC_URI` in your Coral environment variables, you can do so here on the host test bed to ensure you're fully testing the capabilities of a CDN loading Coral onto the page.

To do so, simply set the `STATIC_URI` value via the `staticURI` property on a site in the `config.json`.

```
{
  "sites": [
    {
      "port": 8000,
      "coralURL": "http://localhost:3000",
      "staticURI": "http://localhost:3001", <-- your static URI here
      "stories": [
        ...
      ]
    }
}
```

## Start it up

```
npm run start:host
```

When it completes, navigate to the URL you set in the `config.json` (likely http://localhost:8000 or similar).

You'll need to run Coral with:

```
npm run build
npm run start
```

NOTE: you can do a debuggable dev build via `build:development` and `start:development`.

NOTE: If you are using `npm run watch` to start up Coral, you can change the `coralURL` to `http://localhost:8080` in your `config.json`.

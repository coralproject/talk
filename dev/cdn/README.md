# CDN Test Suite

This is a useful test CDN for ensuring that the `STATIC_URI` works properly with Coral. In the wild, Coral is serving its static assets (the client js, css, and other assets) via a CDN. This emulates that behavior.

## Initialize the repo

This should have been done when you initialized the upper root Coral repo. If not, at the root of the repository, run:

```
npm install
```

## Setting `STATIC_URI`

In your Coral root `.env` file, set the `STATIC_URI` value to `http://localhost:3001`.

Example:
```
...
STATIC_URI=http://localhost:3001
...
```

## Changing the port of the CDN

In your Coral root `.env` file, set the `CDN_PORT` value to whatever you want the port to be.

Example for port 7000:
```
...
STATIC_URI=http://localhost:7000
CDN_PORT=7000
```

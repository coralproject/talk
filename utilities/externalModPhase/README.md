# utilities/externalModPhase

This script allows you to easily spin up an external web service for testing the external mod phases functionality within Coral.

# What is an external mod phase?

Full docs here: [https://docs.coralproject.net/external-moderation-phases](https://docs.coralproject.net/external-moderation-phases).

The gist is, when a comment comes in, you can configure Coral to call an external endpoint with the comment data, which can then return a result that Coral will then use to apply moderation actions to said comment.

# Getting started

Install the dependencies and spin up the service.

```
cd utilities/externalModPhase
npm i
npm run start
```

# Example `.env` config file

```
PORT=7000
HOST=localhost
```

The above will configure the app to host on `http://localhost:7000`. If you don't provide a `.env` file in `utilities/externalModPhase`, it will also default to `http://localhost:7000`.

# Using the external mod phase end points

The way this works is you configure new external mod phases in Coral under `Admin > Configure > Moderation Phases > Moderation Phase` and set the `Callback URL` to one of the endpoints hosted by this app.

An example of some of these endpoints are:

- `/api/approve`
  - Will approve any external mod phase comment data sent to it
- `/api/reject`
  - Will reject any external mod phase comment data sent to it
- `/api/rejectWithReason`
  - Used in conjuntion with DSA features being enabled which require a reason for rejecting comments
  - Will reject and provide a reason for any external mod phase comment data sent to it

Future endpoints may be added over time, check `src/main.ts` and look through it for further details.
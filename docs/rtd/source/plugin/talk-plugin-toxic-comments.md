
# talk-plugin-toxic-comments
[View Source on GitHub](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-toxic-comments/)

```
    name: talk-plugin-toxic-comments
    provides:
        - Server
        - Client
```


Using the [Perspective API](http://perspectiveapi.com/), this
plugin will warn users and reject comments that exceed the predefined toxicity
threshold. For more information on what Toxic Comments are, check out the
[Toxic Comments](../03-05-product-guide-toxic-comments.html) documentation.

Configuration:

- `TALK_PERSPECTIVE_API_KEY` (**required**) - The API Key for Perspective. You
  can register and get your own key at [http://perspectiveapi.com/](http://perspectiveapi.com/).
- `TALK_TOXICITY_THRESHOLD` - If the comments toxicity exceeds this threshold,
  the comment will be rejected. (Default `0.8`)
- `TALK_PERSPECTIVE_API_ENDPOINT` - API Endpoint for hitting the
  perspective API. (Default `https://commentanalyzer.googleapis.com/v1alpha1`)
- `TALK_PERSPECTIVE_TIMEOUT` - The timeout for sending a comment to
  be processed before it will skip the toxicity analysis, parsed by
  [ms](https://www.npmjs.com/package/ms). (Default `300ms`)
- `TALK_PERSPECTIVE_DO_NOT_STORE` - Whether the API is permitted to store comment and context from this request. Stored comments will be used for future research and community model building purposes to improve the API over time. (Default `true`) [Perspective API - Analize Comment Request](https://github.com/conversationai/perspectiveapi/blob/master/api_reference.md#analyzecomment-request)
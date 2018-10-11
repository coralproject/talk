# Toxic Comments


Leveraging Google's Perspective API, you can now set a Toxicity Threshold for
Talk (0.8 or 80% is the default), which works like this:

- If a comment exceeds the threshold, the commenter is warned that their comment
  may be toxic, and are given the chance to modify their comment before posting
- If the revised comment is below the Toxicity Threshold, it is posted and
  displayed normally
- If the revised comment still exceeds the Toxicity Threshold, it is not
  displayed on the stream and instead is sent to the Reported queue for
  moderation
- If the moderator accepts the comment, it's displayed on the stream; if it's
  rejected, it will not be displayed
- Moderators see a Toxic Probability Score on toxic comments in the Moderation
  queues

Read more about Coral’s take on toxicity
[on our blog](https://coralproject.net/blog/toxic-avenging/).

## What is the Perspective API?

The likely toxicity of a comment is evaluated using scores generated from
[Perspective API](http://perspectiveapi.com/). This is part of
the [Conversation AI](https://conversationai.github.io/)
research effort run by Jigsaw (a section of Google that works on global problems
around speech and access to information).

Perspective API uses machine learning, based on existing databases of
accepted/rejected comments, to guess the probability that a comment is abusive
and/or toxic. It is currently English only, but the system is designed to work
with multiple languages.

In order to activate our plugin, each news organization applies for an API key
from Jigsaw (click “Request API access” on this site.) Sites can also work with
Jigsaw to create an individualized data set specifically trained on their own
comment history.

Perspective API was released earlier this year, and is currently in alpha
(meaning that it is being continually refined and improved.) Jigsaw should
certainly be praised for devoting serious resources to this issue, and making
their work available for others, including us, to use.

We’ve talked with their team on several occasions, and have been impressed by
their dedication and commitment to this issue. These are smart people who are
trying to improve a broken part of the internet.

## How do I add the Toxic Comments plugin?
To enable this behavior, visit the
[talk-plugin-toxic-comments](03-05-product-guide-toxic-comments.html)
plugin documentation.


## Request an API Key

You can read more about Google's Perspective API and/or request an API key here: [http://perspectiveapi.com/](http://perspectiveapi.com/).

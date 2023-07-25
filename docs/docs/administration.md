---
id: administration
title: Admin Settings
---

Upon completing the installation setup wizard, you will be able to login to Coral with the ADMIN user you created during setup.

## Moderation queues

All moderation queues are sorted by Most Recent at the top.

### Reported

This is the most urgent queue – these are comments that are still on the page, might be a problem, and you haven't made a moderation decision about them yet. These comments have either been Reported by a user, or reported by the system because they contain suspect words or phrases.

### Pending

These are comments that have been held back by the system for some reason. These are the reasons that comments are held back in Pending:

- The article or site is set to pre-moderate all comments (except for Staff/Moderator/Admin/Expert comments)
- The commenter has been manually set to 'Always Pre-moderate' by a moderator
- The comment has been ruled as 'Likely to be toxic' by the AI (optional)
- The commenter's recent behavior has included a higher percentage of rejected comment than the threshold you set in Configure ('Recent History') (optional)
- The commenter has entered an identical comment twice in a row, anywhere on the site
- The site is set to hold back for review the first comments by new commenters (optional)
- The comment is marked as likely to spam by our spam detection system (optional)

Users who login with the ADMIN role are able to access the Configure tab, and from here change settings that control the functionality of your Coral instance.

### Unmoderated

These are comments of any kind - Reported, Published, Pending - that a moderator hasn't yet accepted or rejected.

### Approved

These are comments that a moderator has already approved. The name of the moderator is included on the card.

### Rejected

These are comments that a moderator has already rejected. The name of the moderator is included on the card.

There is also a clock icon in the top right of the page. When you click the icon, you will see a list of the comments that you have recently moderated, with links to review your decision.

## Configure Menu Settings

### Language

You can set the default language Coral uses in **Admin** > **Configure** > **General**.

You can see what languages Coral currently supports here: https://github.com/coralproject/talk/tree/master/src/locales

### Comment Stream Settings

Also located in **Admin** > **Configure** > **General** are the setting to control the comment stream. These settings are site-wide and will affect all of your comment streams.

#### **Community guidelines summary**

This will appear above the comments sitewide. You can format the text using Markdown.

#### **Sitewide closed comments message**

A message that will be displayed when comment streams are closed sitewide.

#### **Comment length**

Set minimum and maximum comment length requirements. Blank spaces at the beginning and the end of a comment will be trimmed. Some newsrooms we’ve worked with prefer a limit between 2000 and 5000
characters. Commenters will be alerted that they have gone over that number and won’t be able to submit their comment until they’ve edited it. This can be a useful tool to ensure commenters are concise with their comments.

#### **Comment editing**

Set a limit on how long commenters have to edit their comments sitewide. Edited comments are marked as (Edited) on the comment stream and the moderation panel.

#### **Closing comment streams**

Set comment streams to close after a defined period of time after a story’s publication. When this feature is enabled, existing stories older than the defined period that have not been manually opened or closed will also be updated and set as closed. Manually opening or closing a story will permanently override the auto-close functionality.

#### **Closed comment stream message**

A message to appear when a story is closed for commenting.

### Reactions

Coral comes with a `Respect` button out of the box. Why a “Respect” button, you
ask?
[Read more here](https://mediaengagement.org/research/engagement-buttons/).

You can also create your own custom reaction
buttons by modifying the Reaction label.

### Badges & Staff Member Badge

Badges differentiate users on the comment stream. By default, the `Staff` user badge displays when a commenter has an Admin, Moderator, or Staff role.

You can customize the badge label used for Staff roles by providing your own custom badge text. _i.e.: "NewsSite Team"_

Custom user badges are also available with SSO integrations. See [Single Sign On](/sso)

## Moderation

These options can be found under **Admin** > **Configure** > **Moderation**.

### Pre-moderation

When pre-moderation is turned on, comments will not be published unless approved by a moderator.

### Recent History

Prevents repeat offenders from publishing comments without approval. When a commenter's rejection rate is above the threshold, their comments are sent to the Pending queue for moderation. This does not apply to Staff comments.

Rejection rate time period determines the look back period of commenter activity that will be considered in performing the calculation.

Rejection rate threshold is calculated by dividing
number of Rejected comments by (rejected comments + published comments) over the time period specified, and is displayed as a percentage. It does not include comments pending for toxicity, spam or pre-moderation, only moderated comments are considered.

### Toxic Comment Filter

Using Google's Perspective API, the Toxic Comment Filter warns users when comments exceed the predefined toxicity threshold. You can read more about Google’s Perspective API and/or request an API key here: http://perspectiveapi.com/.

Comments with a toxicity score above the threshold will not be published and are placed in the Pending Queue for review by a moderator. Only if approved by a moderator, then the comment will be published.

If a comment exceeds the threshold, the commenter is warned that their comment may be toxic, and are given the chance to modify their comment before posting. If the revised comment is below the Toxicity Threshold, it is posted and displayed normally; however if the revised comment still exceeds the Toxicity Threshold, it is not displayed on the stream and instead is sent to the Pending queue for moderation.

Perspective API uses machine learning based on existing databases of accepted/rejected comments to guess the probability that a comment is abusive and/or toxic. English is the default language, but experimental models are available in multiple languages. Sites can also work with Jigsaw to create an individualized data set specifically trained on their own comment history. Read more about Coral’s take on toxicity [on our blog](https://coralproject.net/blog/toxic-avenging/).

### Spam Detection Filter

Enables spam detection from [Akismet](https://akismet.com/). Comments will be passed to the Akismet API for spam detection. If a comment is determined to be spam, it will prompt the user, indicating that the comment might be considered spam. If the user continues after this point with the still spam-like comment, the comment will be reported as containing spam, and sent for moderator approval.

_Note: Akismet is a premium service, charges may apply._

## Banned & Suspect Words and Phrases

Located in **Admin** > **Configure** > **Banned words and phrases**.

**Banned words** are a list of words or phrases that will trigger a comment to be automatically **Rejected**.

Comments containing a word or phrase in the **Suspect Words** List are placed into the **Reported** queue for moderator review and are published (if comments are not pre-moderated).

Lists of words/phrases are not case sensitive, and are separated by new lines.

_Note: occasionally comments are marked "Possible Banned Word" - this happens when the banned word check times out, so we don't know if the comment included a banned word or not.  This happens most often in newsrooms that include several thousand banned words on their lists.  It should only occur on a small percentage of your comments.  We will be fixing this problem in the future, so in the meantime you might try trimming your Banned Word list of words/phrases that seem very unlikely to appear, to reduce the frequency of this issue._

## Email SMTP Settings

These settings can be found under **Admin** > **Configure** > **Email**.

You can configure a **From Name** as well as a **From Email Address** to appear on all outgoing emails.

Coral will use your SMTP provider for all outgoing mail including user invites, email verifications, password resets, and notifications. Specify your SMTP provider's settings for Host, Port, and authentication to send emails from Coral.

The `Invite` (users) button on the Community tab will only be available if Email settings have been configured.

## Advanced

Located in **Admin** > **Configure** > **Advanced**.

### Embed Code

This is the unique script that is used to embed Coral comment streams on your website. For more information about using your Embed code see [CMS Integration](/cms/).

### Custom CSS

The link to your custom stylesheet. This will override any default styles, so you can style the comment embed to match your site.

### Live Updates

When enabled, there will be real-time loading and updating of comments via subscriptions
(specifically GraphQL Subscriptions). When disabled, users will have to refresh the page to see new comments.

Coral enables this via “Load More” buttons for both top-level comments (this
button appears at the top of the stream), and within conversation threads (this
button appears in situ for replies).

We’ve decided to go this route in order to make the viewing experience as smooth
as possible, so that the feed of comments doesn’t change as you’re reading just
because new comments are coming in. This could be especially disruptive on
breaking news and/or controversial stories with very active discussions.

This option can be disabled by setting the environment variable: [DISABLE_LIVE_UPDATES](/environment-variables#disable-live-updates)

### Permitted Domains

List of domains where your Coral instance is allowed to be embedded. List each domain and subdomain in use separately and include the scheme for example: `http://localhost:3000`, `https://staging.yourdomain.com`, `http://yourdomain.com`, `https://yourdomain.com`, etc.

### Story Creation Settings

Advanced settings for how stories are created within Coral; such as if stories are to be automatically created when they are published from your CMS.

See CMS Integration sections [Story Creation](/cms/#story-creation) and [Story Scraping](/cms/#story-scraping) for more details.

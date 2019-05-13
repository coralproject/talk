---
title: talk-plugin-facebook-auth
permalink: /plugin/talk-plugin-facebook-auth/
layout: plugin
plugin:
    name: talk-plugin-facebook-auth
    depends:
        - name: talk-plugin-auth
    provides:
        - Server
        - Client
---

Enables sign-in via Facebook via the server side passport middleware. Requires creating and registering a login app with Facebook. 

**Configuration:**

- `TALK_FACEBOOK_APP_ID` (**required**) - The Facebook App ID for your Facebook
  Login enabled app. This is only required while the `talk-plugin-facebook-auth` plugin is
  enabled.
- `TALK_FACEBOOK_APP_SECRET` (**required**) - The Facebook App Secret for your
  Facebook Login enabled app. This is only required while the `talk-plugin-facebook-auth` plugin is
  enabled.
  
You can learn more about getting a Facebook App ID at the
  [Facebook Developers Portal](https://developers.facebook.com) or by visiting
  their [Creating an App ID](https://developers.facebook.com/docs/apps/register)
  guide.

**Setting up your Facebook app:**
* Go to [Facebook Developers Portal](https://developers.facebook.com) and click on Getting Started or My Apps
* Create a new app > set the App Name and Email to create an app id
* Confirm that you are not a robot, then configure the app as follows:
* In Settings > Basic:
    * add app domains (your Talk domain)
    * add a link to your privacy policy
    * add a link to your terms of service
* In Settings > Advanced:
    * turn on "Require App Secret"
* Add a "Product" (Under "Products" click + to add a Product):
    * Setup "Facebook Login"
    * choose `www` 
    * enter your Talk domain url
    * click _Next_ several times to get through the add code steps (You do not need to modify any code, the plugin takes care of this part for you.)
* Under Product Settings:
    * set Valid OAuth Redirect URIs to your callback url (Use your Talk domain with this endpoint: `/api/v1/auth/facebook/callback`)
    * Locate your App Id and App Secret, set these as config vars on your instance of Talk
* Toggle the "Live" button on the top bar to make app live


_NOTE: Facebook auth requires your site to use `https` (SSL) not `http`. If your site is not `https` you can not use this plugin!_

## GDPR Compliance

In order to facilitate compliance with the
[EU General Data Protection Regulation (GDPR)](https://www.eugdpr.org/), you
should review our [GDPR Compliance](/talk/integrating/gdpr/) guidelines.
